import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as synced_folder from '@pulumi/synced-folder';
import * as command from '@pulumi/command';

const config = new pulumi.Config();
const path = config.get('path') || './www';
const indexDocument = config.get('indexDocument') || 'index.html';
const errorDocument = config.get('errorDocument') || 'error.html';
const domainName = 'recetalias.com';
const subdomainName = `www.${domainName}`;

// ACM certificate for the domain
const certificate = new aws.acm.Certificate('certificate', {
	domainName: domainName,
	subjectAlternativeNames: [subdomainName],
	validationMethod: 'DNS'
});

const certificateValidation = new aws.acm.CertificateValidation('certificate-validation', {
	certificateArn: certificate.arn
});

// Create an S3 bucket and configure it as a website.
const bucket = new aws.s3.Bucket('bucket');

const bucketWebsite = new aws.s3.BucketWebsiteConfiguration('bucketWebsite', {
	bucket: bucket.bucket,
	indexDocument: { suffix: indexDocument },
	errorDocument: { key: errorDocument }
});

// Ownership controls for the new S3 bucket
const ownershipControls = new aws.s3.BucketOwnershipControls('ownership-controls', {
	bucket: bucket.bucket,
	rule: {
		objectOwnership: 'ObjectWriter'
	}
});

// Public ACL block on the new S3 bucket
const publicAccessBlock = new aws.s3.BucketPublicAccessBlock('public-access-block', {
	bucket: bucket.bucket,
	blockPublicAcls: false
});

// Use a synced folder to manage the files of the website.
const bucketFolder = new synced_folder.S3BucketFolder(
	'bucket-folder',
	{
		path: path,
		bucketName: bucket.bucket,
		acl: 'public-read'
	},
	{ dependsOn: [ownershipControls, publicAccessBlock] }
);

const cdn = new aws.cloudfront.Distribution(
	'cdn',
	{
		enabled: true,
		aliases: [domainName, subdomainName],
		origins: [
			{
				originId: bucket.arn,
				domainName: bucketWebsite.websiteEndpoint,
				customOriginConfig: {
					originProtocolPolicy: 'http-only',
					httpPort: 80,
					httpsPort: 443,
					originSslProtocols: ['TLSv1.2']
				}
			}
		],
		defaultCacheBehavior: {
			targetOriginId: bucket.arn,
			viewerProtocolPolicy: 'redirect-to-https',
			allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
			cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
			defaultTtl: 600,
			maxTtl: 600,
			minTtl: 600,
			forwardedValues: {
				queryString: true,
				cookies: {
					forward: 'all'
				}
			}
		},
		priceClass: 'PriceClass_100',
		customErrorResponses: [
			{
				errorCode: 403,
				responseCode: 404,
				responsePagePath: '/404.html'
			},
			{
				errorCode: 404,
				responseCode: 404,
				responsePagePath: '/404.html'
			}
		],
		restrictions: {
			geoRestriction: {
				restrictionType: 'none'
			}
		},
		viewerCertificate: {
			acmCertificateArn: certificate.arn,
			sslSupportMethod: 'sni-only',
			minimumProtocolVersion: 'TLSv1.2_2021'
		}
	},
	{ dependsOn: [certificateValidation] } // Let's wait for DNS validation to complete
);

new command.local.Command(
	'invalidate-cache',
	{
		create: pulumi.interpolate`aws cloudfront create-invalidation --distribution-id ${cdn.id} --paths "/*"`,
		triggers: [Date.now()]
	},
	{ dependsOn: [bucketFolder, cdn] }
);

// Outputs:
export const websiteURL = pulumi.interpolate`https://${domainName}`;

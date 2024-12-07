import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';  // Import the Construct class from the 'constructs' module
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';

// The main stack class
export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 Bucket
    const myBucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,  // Only for dev/test environments
    });

    // Create Lambda Function with updated runtime
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_16_X,  // Updated to Node.js 16.x runtime
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Lambda invoked!');
          return { statusCode: 200, body: 'Hello, World!' };
        }
      `),
      environment: {
        BUCKET_NAME: myBucket.bucketName,
      },
    });

    // Grant the Lambda function permission to read from the S3 bucket
    myBucket.grantRead(myLambda);

    // Create DynamoDB Table
    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'MyTable',
      removalPolicy: RemovalPolicy.DESTROY,  // Only for dev/test environments
    });

    // Output the S3 Bucket and DynamoDB Table name
    new cdk.CfnOutput(this, 'MyBucketName', {
      value: myBucket.bucketName,
      description: 'The name of the S3 bucket',
    });

    new cdk.CfnOutput(this, 'MyTableName', {
      value: myTable.tableName,
      description: 'The name of the DynamoDB table',
    });
  }
}

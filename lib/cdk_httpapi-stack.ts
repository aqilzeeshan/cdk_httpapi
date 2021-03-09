import { HttpApi, HttpMethod} from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration} from '@aws-cdk/aws-apigatewayv2-integrations';
import { Code, Function as LambdaFunction, Runtime } from '@aws-cdk/aws-lambda';
import { Construct, Stack, StackProps } from '@aws-cdk/core';

export class CdkHttpapiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const serviceName = 'order-service';

    const orderServiceEntryPointLambda = new LambdaFunction(this, 'OrderServiceEntryPointLambdaFunction', {
      code: Code.fromAsset('./lambda'),
      functionName: `${serviceName}-entry-point`,
      handler: 'app.lambda_handler',
      runtime: Runtime.PYTHON_3_8,
    });

    const orderServiceHttpApi = new HttpApi(this, 'OrderServiceHttpApiGateway', {
      apiName: serviceName,
    });

    const orderServiceLambdaProxyIntegration = new LambdaProxyIntegration({
      handler: orderServiceEntryPointLambda,
    });

    orderServiceHttpApi.addRoutes({
      integration: orderServiceLambdaProxyIntegration,
      methods: [HttpMethod.POST],
      path: '/order',
    });

    orderServiceHttpApi.addRoutes({
      integration: orderServiceLambdaProxyIntegration,
      methods: [HttpMethod.GET],
      path: '/orders',
    });

    orderServiceHttpApi.addRoutes({
      integration: orderServiceLambdaProxyIntegration,
      methods: [HttpMethod.GET, HttpMethod.PUT],
      path: '/order/{orderId}',
    });
  }
}

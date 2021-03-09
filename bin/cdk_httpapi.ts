#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkHttpapiStack } from '../lib/cdk_httpapi-stack';

const app = new cdk.App();
new CdkHttpapiStack(app, 'CdkHttpapiStack');

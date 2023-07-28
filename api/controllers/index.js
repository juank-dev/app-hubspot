const ContactController = require('./contact');
const ProductController = require('./product');
const InstallerController = require('./installer');
const APILocationController = require('./location');
const RegisterController = require('./register');
const DealController = require('./deal');
const PipelineController = require('./pipeline');
const LineitemsController = require('./lineItems');
const AssociationsController = require('./associations');
const OwnerController = require('./owner');
const WebhookHubspotController = require('./webhookHubspot');

module.exports = {
  ContactController,
  InstallerController,
  ProductController,
  APILocationController,
  RegisterController,
  DealController,
  PipelineController,
  LineitemsController,
  AssociationsController,
  OwnerController,
  WebhookHubspotController
};

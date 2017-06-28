/**
 * Bugsang setting
 * (sails.config.bugsnag)
 *
 * Configuration for bugsnag which will monitor
 * all the application level errors
 *
 * For more information on configuration, check out:
 * https://github.com/bugsnag/bugsnag-node
 */

module.exports.bugsnag = {
  apiKey: "596e92a63bb540fec66b3e45e28a44de",
  enabled: true,
  options: {
    notifyReleaseStages: ['development', 'staging', 'production']
  }
}


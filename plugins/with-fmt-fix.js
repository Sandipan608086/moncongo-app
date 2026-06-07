const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      if (podfile.includes('FMT_USE_CONSTEVAL=0')) {
        return config;
      }

      const fmtFix = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |cfg|
      cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
      unless cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'].include?('FMT_USE_CONSTEVAL=0')
        cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'FMT_USE_CONSTEVAL=0'
      end
    end
  end
`;

      // Simple string replacement — insert right after opening of post_install block
      podfile = podfile.replace(
        'post_install do |installer|',
        `post_install do |installer|${fmtFix}`
      );

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
};
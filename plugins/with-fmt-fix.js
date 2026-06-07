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
# Fix for fmt consteval errors with Xcode 26
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |cfg|
      defs = cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']
      defs = [defs] if defs.is_a?(String)
      unless defs.include?('FMT_USE_CONSTEVAL=0')
        defs << 'FMT_USE_CONSTEVAL=0'
      end
      cfg.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs
    end
  end
end
`;

      fs.writeFileSync(podfilePath, podfile + '\n' + fmtFix);
      return config;
    },
  ]);
};
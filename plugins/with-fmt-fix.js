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

      const fmtFix = [
        '  # Fix for fmt consteval errors with Xcode 26',
        '  installer.pods_project.targets.each do |target|',
        '    target.build_configurations.each do |cfg|',
        '      defs = cfg.build_settings[\'GCC_PREPROCESSOR_DEFINITIONS\'] || [\'$(inherited)\']',
        '      defs = [defs] if defs.is_a?(String)',
        '      defs << \'FMT_USE_CONSTEVAL=0\' unless defs.include?(\'FMT_USE_CONSTEVAL=0\')',
        '      cfg.build_settings[\'GCC_PREPROCESSOR_DEFINITIONS\'] = defs',
        '    end',
        '  end',
      ].join('\n');

      const lines = podfile.split('\n');
      const idx = lines.findIndex(l => l.includes('post_install do |installer|'));

      if (idx !== -1) {
        lines.splice(idx + 1, 0, fmtFix);
        fs.writeFileSync(podfilePath, lines.join('\n'));
      }

      return config;
    },
  ]);
};
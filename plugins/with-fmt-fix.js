const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Fix for Xcode 26 / Apple Clang 20 strict consteval enforcement.
 *
 * The FMT_COMPILE_STRING path in fmt uses a separate `consteval` constructor
 * that is NOT controlled by FMT_USE_CONSTEVAL. The only reliable fix is to
 * patch the fmt header files directly and replace `consteval` with `constexpr`.
 *
 * constexpr is a superset at the call-site level — fmt still validates format
 * strings, just at link-time rather than strictly compile-time.
 */
module.exports = function withFmtFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      // Idempotency guard
      if (podfile.includes('# fmt-patch-xcode26')) {
        return config;
      }

      // Ruby snippet injected into post_install.
      // 1. Patch all fmt headers: consteval → constexpr
      // 2. Belt-and-suspenders: set OTHER_CPLUSPLUSFLAGS on every pod target
      const fmtPatch = [
        '  # fmt-patch-xcode26: fix consteval with Apple Clang 20 / Xcode 26',
        '  begin',
        '    fmt_dir = File.join(installer.sandbox.root.to_s, \'fmt\')',
        '    Dir.glob(File.join(fmt_dir, \'**\', \'*.{h,hpp}\')).each do |f|',
        '      content = File.read(f)',
        '      if content.match?(/\\bconsteval\\b/)',
        '        File.write(f, content.gsub(/\\bconsteval\\b/, \'constexpr\'))',
        '        puts "fmt-patch: patched consteval -> constexpr in #{File.basename(f)}"',
        '      end',
        '    end',
        '  rescue => e',
        '    puts "fmt-patch warning: #{e}"',
        '  end',
        '  installer.pods_project.targets.each do |t|',
        '    t.build_configurations.each do |c|',
        '      flags = c.build_settings[\'OTHER_CPLUSPLUSFLAGS\'] || \'$(inherited)\'',
        '      c.build_settings[\'OTHER_CPLUSPLUSFLAGS\'] = flags + \' -DFMT_USE_CONSTEVAL=0\' unless flags.include?(\'FMT_USE_CONSTEVAL\')',
        '    end',
        '  end',
      ].join('\n');

      const lines = podfile.split('\n');
      const idx = lines.findIndex(l => l.trim().startsWith('post_install do |installer|'));

      if (idx !== -1) {
        lines.splice(idx + 1, 0, fmtPatch);
        fs.writeFileSync(podfilePath, lines.join('\n'));
        console.log('with-fmt-fix: injected fmt header patch into Podfile post_install block');
      } else {
        console.warn('with-fmt-fix: WARNING — could not find post_install block in Podfile');
      }

      return config;
    },
  ]);
};
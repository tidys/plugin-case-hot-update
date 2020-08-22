const Path = require('path');
let packer = require('cc-plugin-packer');
packer({
    plugin: Path.join(__dirname, 'packages/hot-update-tools'),
    filterFiles: ['mail', 'test', 'README.md'],
    dontMinJs: ['main_code.js', 'core/GoogleAnalytics.js'],
    show: true,
});

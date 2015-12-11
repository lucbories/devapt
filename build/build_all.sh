

# babel common/base         --out-file dist/common-base-compiled.js        --watch --source-maps
# babel common/executables  --out-file dist/common-executables-compiled.js --watch
# babel common/metrics      --out-file dist/common-metrics-compiled.js     --watch
# babel common/parser       --out-file dist/common-parser-compiled.js      --watch
# babel common/rendering    --out-file dist/common-rendering-compiled.js   --watch
# babel common/resources    --out-file dist/common-resources-compiled.js   --watch
# babel common/servers      --out-file dist/common-servers-compiled.js     --watch
# babel common/services     --out-file dist/common-services-compiled.js    --watch
# babel common/store        --out-file dist/common-store-compiled.js       --watch
# babel common/test         --out-file dist/common-test-compiled.js        --watch
# babel common/utils        --out-file dist/common-utils-compiled.js       --watch

# babel server/start.js     --out-file dist/server/start.js       --watch
# babel server/cli.js       --out-file dist/server/cli.js         --watch

# babel apps/private/devtools/logs   --out-file dist/apps-devtools-logs-compiled.js   --watch
# babel apps/private/devtools/store  --out-file dist/apps-devtools-store-compiled.js  --watch


echo "clean dist"
test -d dist/ && rm -rf dist/*

echo "create dist sub directories"
test -d dist/apps    || mkdir dist/apps
test -d dist/modules || mkdir dist/modules
test -d dist/plugins || mkdir dist/plugins

echo "copy apps to dist"
cp -r src/apps/*     dist/apps/

echo "copy modules to dist"
cp -r src/modules/*  dist/modules/

echo "copy plugins to dist"
cp -r src/plugins/*  dist/plugins/


echo "compile js code to dist"
babel src --out-dir dist/ --source-maps --presets es2015


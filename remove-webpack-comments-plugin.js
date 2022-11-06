class RemoveWebpackCommentsPlugin {
  //  第二步，类中必须包含 apply 方法。 在webpack初始化的时候会统一实例化并调用。
  apply(compiler) {
    // 第三步 通过 compiler.hooks.? 拿到 webpack构建过程中广播出来的事件，并且
    compiler.hooks.emit.tap('RemoveWebpackCommentsPlugin', compilation => {
      // compilation => 包含了此次构建的所有文件的信息
      for (const name in compilation.assets) {
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source();

          // 将所有 /*****/ 的注释替换成空字符串
          const noComments = contents.replace(/\/\*{2,}\/\s?/g, '');
          compilation.assets[name] = {
            source: () => noComments,
            size: () => noComments.length,
          };
        }
      }
    });
  }
}

module.exports = RemoveWebpackCommentsPlugin;

const { path } = require('@vuepress/utils')
module.exports = {
  title: 'cosla前端团队开发文档',
  themeConfig: {
    logo: '/logo.png',
    lastUpdatedText: '上次更新',
    navbar: [
      { text: '首页', link: '/' },
      {
        text: '技术栈',
        link: '/pages/techstacks/vehicleWebClient.md',
        children: [
          {
            text: 'vehicle-web-client',
            link: '/pages/techstacks/vehicleWebClient.md'
          },
          {
            text: 'vehicle-miniprogram',
            link: '/pages/techstacks/vehicleMiniprogram.md'
          }
        ]
      },
      {
        text: '注意事项',
        link: '/pages/attention/vehicleWebClient.md',
        children: [
          {
            text: 'vehicle-web-client',
            link: '/pages/attention/vehicleWebClient.md'
          },
          {
            text: 'vehicle-miniprogram',
            link: '/pages/attention/vehicleMiniprogram.md'
          }
        ]
      },
      {
        text: '自定义组件',
        link: '/pages/customComponents/vehicleWebClient.md',
        children: [
          {
            text: 'vehicle-web-client',
            link: '/pages/customComponents/vehicleWebClient.md'
          },
          {
            text: 'vehicle-miniprogram',
            link: '/pages/customComponents/vehicleMiniprogram.md'
          }
        ]
      },
    ]
  },
  // 插件
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(__dirname, '../components'),
      },
    ],
    ['@snippetors/vuepress-plugin-code-copy', true]
  ],
  // 打包工具
  bundler: '@vuepress/bundler-webpack',
  bundlerConfig: {
    less: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  },
  port: 8081
}

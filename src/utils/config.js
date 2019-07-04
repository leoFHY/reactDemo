module.exports = {
  siteName: '全民经纪人后台',
  copyright: '上海蓝裔网络科技有限公司  © 2019',
  logoPath: '/public/logo.png',
  // apiPrefix: '/api/v1',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  // layouts: [
  //   {
  //     name: 'primary',
  //     include: [/.*/],
  //     exlude: [/(\/(en|zh))*\/productList/],
  //   },
  // ],
  layouts: [{
    name: 'primary',
    include: [/.*/],
    // exlude: [/(\/(en|zh))*\/login/],
  }, ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    // defaultLanguage: 'zh',
  },
}

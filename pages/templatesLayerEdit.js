﻿var $api = axios.create({
  baseURL:
    utils.getQueryString("apiUrl") +
    "/" +
    utils.getQueryString("pluginId") +
    "/pages/templatesLayerEdit/",
  params: {
    siteId: utils.getQueryInt('siteId')
  },
  withCredentials: true
});

var data = {
  siteId: utils.getQueryString('siteId'),
  name: utils.getQueryString('name'),
  isSystem: utils.getQueryBool('isSystem'),
  pageLoad: false,
  pageAlert: null,
  templateInfo: null
};

var methods = {
  load: function () {
    var $this = this;
    $api.get('', {
      params: {
        name: this.name
      }
    }).then(function (response) {
      var res = response.data;
      $this.templateInfo = res.value;

      if ($this.isSystem) {
        $this.pageAlert = {
          type: 'warning',
          html: '提示：' + utils.getQueryString("name") + ' 为系统模板，编辑此模板需要克隆至指定文件夹'
        };
      }
    }).catch(function (error) {
      $this.pageAlert = utils.getPageAlert(error);
    }).then(function () {
      $this.pageLoad = true;
    });
  },

  getTemplateHtml: function() {
    return parent.$vue.getEditorContent();
  },

  apiClone: function() {
    var $this = this;

    utils.loading(true);
    $api.post('', {
      originalName: $this.name,
      name: $this.templateInfo.name,
      description: $this.templateInfo.description,
      templateHtml: $this.getTemplateHtml()
    }).then(function (response) {
      swal({
        toast: true,
        type: 'success',
        title: "模板克隆成功！",
        showConfirmButton: false,
        timer: 2000
      }).then(function () {
        parent.location.href = utils.getPageUrl('templates.html')
      });
    }).catch(function (error) {
      $this.pageAlert = utils.getPageAlert(error);
    }).then(function () {
      utils.loading(false);
    });
  },

  apiEdit: function() {
    var $this = this;

    utils.loading(true);
    $api.put('', {
      originalName: $this.name,
      name: $this.templateInfo.name,
      description: $this.templateInfo.description
    }).then(function (response) {
      swal({
        toast: true,
        type: 'success',
        title: "模板编辑成功！",
        showConfirmButton: false,
        timer: 2000
      }).then(function () {
        parent.location.href = utils.getPageUrl('templates.html')
      });
    }).catch(function (error) {
      $this.pageAlert = utils.getPageAlert(error);
    }).then(function () {
      utils.loading(false);
    });
  },

  btnSubmitClick: function () {
    var $this = this;
    this.$validator.validate().then(function (result) {
      if (result) {
        
        if ($this.isSystem) {
          $this.apiClone();
        } else {
          $this.apiEdit();
        }
      }
    });
  }
};

new Vue({
  el: '#main',
  data: data,
  methods: methods,
  created: function () {
    this.load();
  }
});
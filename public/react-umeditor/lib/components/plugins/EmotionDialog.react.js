'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');

var TabGroup = require('../base/TabGroup');
var Dialog = require('../base/Dialog');

var _require = require('../../constants/EditorConstants'),
    EmotionImages = _require.EmotionImages;

var EmotionPanel = function (_React$Component) {
	_inherits(EmotionPanel, _React$Component);

	function EmotionPanel() {
		_classCallCheck(this, EmotionPanel);

		return _possibleConstructorReturn(this, (EmotionPanel.__proto__ || Object.getPrototypeOf(EmotionPanel)).apply(this, arguments));
	}

	_createClass(EmotionPanel, [{
		key: 'handleClick',
		value: function handleClick(e) {
			e = e || event;
			var target = e.target || e.srcElement;
			var url = target.getAttribute("data-url");
			var title = target.getAttribute("data-title");

			if (this.props.onSelectImage) {
				var img = document.createElement('img');
				img.src = url;
				img.title = title;
				this.props.onSelectImage(e, img);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var images = this.props.images;
			var handleClick = this.handleClick.bind(this);
			return React.createElement(
				'ul',
				{ className: "emotion-images " + this.props.name },
				images.map(function (ele, pos) {
					return React.createElement(
						'li',
						{ className: 'emotion-image', key: pos, 'data-url': ele.url, 'data-title': ele.title, onClick: handleClick },
						React.createElement('img', { src: ele.url, title: ele.title, 'data-url': ele.url, 'data-title': ele.title })
					);
				})
			);
		}
	}]);

	return EmotionPanel;
}(React.Component);

var EmotionDialog = function (_React$Component2) {
	_inherits(EmotionDialog, _React$Component2);

	function EmotionDialog(props) {
		_classCallCheck(this, EmotionDialog);

		var _this2 = _possibleConstructorReturn(this, (EmotionDialog.__proto__ || Object.getPrototypeOf(EmotionDialog)).call(this, props));

		_this2.state = {
			handle: function handle() {}
		};
		return _this2;
	}

	_createClass(EmotionDialog, [{
		key: 'open',
		value: function open(handle) {
			this.setState({
				handle: handle
			});
			this.refs.root.open();
		}
	}, {
		key: 'close',
		value: function close() {
			if (this.refs.root) this.refs.root.close();
		}
	}, {
		key: 'toggle',
		value: function toggle(handle) {
			this.setState({
				handle: handle
			});
			this.refs.root.toggle();
		}
	}, {
		key: 'handleSelectImage',
		value: function handleSelectImage(e, img) {
			e = e || event;
			if (this.state.handle) {
				this.state.handle(e, img);
			}
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
			this.close();
		}
	}, {
		key: 'getEmotionTabs',
		value: function getEmotionTabs() {
			var EmotionTabs = EmotionImages.EmotionTabs,
			    BaseUrl = EmotionImages.BaseUrl,
			    SmileyInfor = EmotionImages.SmileyInfor;

			var tabs = [];
			for (var key in EmotionTabs) {
				var tab = { title: EmotionTabs[key].name };
				var images = [];
				var titles = SmileyInfor[key];
				for (var i = 0; i < titles.length; i++) {
					var index = (i + 1).toString();
					index = index.length == 1 ? "0" + index : index;
					var image = {
						title: titles[i],
						url: BaseUrl + EmotionTabs[key].path + EmotionTabs[key].prefix + index + ".gif?v=1.1"
					};
					images.push(image);
				}
				tab.images = images;
				tabs.push(tab);
			}
			return tabs;
		}
	}, {
		key: 'render',
		value: function render() {
			var tabs = [];
			var EmotionTabs = this.getEmotionTabs();

			for (var i = 0; i < EmotionTabs.length; i++) {
				tabs.push({
					title: EmotionTabs[i].title,
					images: EmotionTabs[i].images,
					component: React.createElement(EmotionPanel, { images: EmotionTabs[i].images, name: 'common-images', onSelectImage: this.handleSelectImage.bind(this) })
				});
			}
			var buttons = [];
			if (this.props.hidden) {
				return React.createElement('div', null);
			} else {
				return React.createElement(
					Dialog,
					{ ref: 'root', className: 'emotion-dropdwon', width: 700, height: 508, title: '\u8868\u60C5', buttons: buttons, onClose: this.close.bind(this) },
					React.createElement(TabGroup, { tabs: tabs })
				);
			}
		}
	}]);

	return EmotionDialog;
}(React.Component);

module.exports = EmotionDialog;
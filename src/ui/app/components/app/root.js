import React, { Component } from 'react';
import { connect } from 'react-redux';
import { httpGet } from '../../../../util/HttpRequest.js';
import './root-common.css';

class Root extends Component {
	constructor(props) {
		super(props);
	}
	// componentDidMount() {
	// 	let { envConfig } = this.props;
	// 	let url = envConfig.env_node['server'].url + ':' + envConfig.env_config_server_port + envConfig.env_health_api.url;
	// 	httpGet(url)
	// 		.then(function (response) {
	// 			console.log('response : ', response);
	// 		});
	// }
	render() {
		return (
			<div className='root-page'>Welcome to Boilerplate</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { envConfig } = state;
	return {
		envConfig
	};
};

export default connect(
	mapStateToProps
)(Root);

import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { Session } from 'meteor/session';

import moment from 'moment';

import './issueDetail.html';

Template.issueDetail.rendered = function(){

	$('#loadingIssue').hide();

	$('#formComment').form({

		fields: {
			comment: {
				identifier  : 'comment',
				rules: [
					{
						type   : 'empty',
						prompt : TAPi18n.__('enter_a_comment')
					}
				]
			},
		}
	});

}

Template.issueDetail.helpers({

	formatDate(date) {
		return moment(date).format('MMM-DD-YYYY hh:mm A');
	},

	getUsername(userId) {
		let name = '';
		let user = Meteor.users.findOne({_id:userId});
		name = user.profile.name;
		try{
			name += user.profile.lastName; 
		}catch(e){
			name = 'User';
		}
		return name;
	},

	labelStatus(status) {
		
		switch(status){
			case 1:
				return TAPi18n.__('not_done');
			case 2:
				return TAPi18n.__('late');
			case 3:
				return TAPi18n.__('score_under');
			default: 
				return '';
		}

	},

	getImagePath(user) {
		let image = Meteor.users.findOne({_id:user}).profile.image;
		if(!image)
			return '/img/faviconGoandSee.png';
		return image;
	},

	inverted(flagged) {
		if(!flagged)
			return 'inverted';
		return '';
	}

});

Template.issueDetail.events({

	'submit #formComment'(e) {
		e.preventDefault();

		$('#loadingIssue').show();

		let comment = $('#comment').val();
		let alertId = $('#formComment').data('id');

		let json = {
			comment : comment,
			alertId : alertId
		};

		Meteor.call('addCommentToIssues', json, function(err, result){

			$('#loadingIssue').hide();

			if (err) {
				Session.set('ERROR_MESSAGE',TAPi18n.__('error_sending_comment'));
				$('#modalError').modal('show');
			} else {
				$('#comment').val('');
			}

		});

	},

	'click #btnFlag'(e) {
		e.preventDefault();

		$('#loadingIssue').show();

		let alertId = $('#formComment').data('id');

		Meteor.call('toggleFlagIssue', alertId, function(err, result){

			$('#loadingIssue').hide();

			if(err){
				Session.set('ERROR_MESSAGE',TAPi18n.__('general_error'));
				$('#modalError').modal('show');
			}

		});

	},

	'click #btnOpen'(e) {
		e.preventDefault();

		$('#loadingIssue').show();

		let alertId = $('#formComment').data('id');

		let json = {
			alertId : alertId,
			isClosed : false
		};

		Meteor.call('sendIssueStatus', json, function(err, result){

			$('#loadingIssue').hide();

			if(err){
				Session.set('ERROR_MESSAGE',TAPi18n.__('general_error'));
				$('#modalError').modal('show');
			}

		});
	},

	'click #btnClose'(e) {
		e.preventDefault();

		$('#loadingIssue').show();

		let alertId = $('#formComment').data('id');

		let json = {
			alertId : alertId,
			isClosed : true
		};

		Meteor.call('sendIssueStatus', json, function(err, result){

			$('#loadingIssue').hide();

			if(err){
				Session.set('ERROR_MESSAGE',TAPi18n.__('general_error'));
				$('#modalError').modal('show');
			}

		});
	}

});

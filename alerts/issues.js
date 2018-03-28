import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { Session } from 'meteor/session';

import moment from 'moment';

import './issues.html';

Template.issues.created = function () {
  
	this.filter = new ReactiveTable.Filter('dates-filter', ['date']);
	this.filter1 = new ReactiveTable.Filter('flagged-filter', ['flagged']);
	this.filter2 = new ReactiveTable.Filter('isClosed-filter', ['isClosed']);
	this.filter3 = new ReactiveTable.Filter('type-filter', ['type']);
	this.filter.set("");
	this.filter1.set("");
	this.filter2.set("");
	this.filter3.set("");

};

Template.issues.rendered = function(){

	$('#startTime').datetimepicker();
	$('#endTime').datetimepicker();
	$('.ui.checkbox').checkbox();

	let filter = Session.get('ISSUES_FILTER');
	if(filter){
		$('#startTime').val(filter.startLabel);
		$('#endTime').val(filter.finishLabel);    	
	}

};

Template.issues.events({

	'click #goToReport'(e) {
		e.preventDefault();

		let id = $(e.target).closest('a').data('id');
		let url = '/issue/' + id;

		let win = window.open(url, '_blank');
		win.focus();

	},

	'click #viewHistory'(e,template) {
		e.preventDefault();

		let startDate = $('#startTime').val();
		let finishDate = $('#endTime').val();

		if(startDate == '' || finishDate == ''){
			Session.set('ERROR_MESSAGE',TAPi18n.__('invalid_dates'));
			$('#modalError').modal('show');
			return;
		}

		startDate = (new Date(startDate)).getTime();
		finishDate = (new Date(finishDate)).getTime();

		if(startDate >= finishDate){
			Session.set('ERROR_MESSAGE',TAPi18n.__('invalid_dates'));
			$('#modalError').modal('show');
			return;
		}

		let filter = {
			'$gt' : date,
			'$lt' : date
		};

		template.filter.set(filter);

	},

	'change #selectType'(e, template) {
		e.preventDefault();
		let value = $('#selectType').val();

		if(value == "0") {
			template.filter3.set("");
		} else {
			template.filter3.set(value);
		}

	},

	'change #selectStatus'(e, template) {
		e.preventDefault();
		let value = $('#selectStatus').val();

		switch(Number(value)){
			case 0 :
				template.filter2.set("");
			break;
			case 1 :
				template.filter2.set('false');
			break;
			case 2 :
				template.filter2.set('true');
			break;
			default:
				template.filter2.set("");
		};

		console.log('Val',value);

	},

	'change #cbFlag'(e, template) {
		e.preventDefault();
		let value = $('#cbFlag').is(':checked');

		if(value){
			template.filter1.set('true');
		} else {
			template.filter1.set('false');
		}
	}

});

Template.issues.helpers({

	settings() {
		return {
			collection: 'alerts-pages',
			rowsPerPage: 5,
			showFilter: true,
			filters: ['dates-filter','type-filter','isClosed-filter','flagged-filter'],
			showColumnToggles : false,
			noDataTmpl: Template.noHistories,
			fields: [
				{
					key : 'isClosed',
					label : TAPi18n.__('status'),
					sortable: true,
					fn(value) {
						if (value) {
							return new Spacebars.SafeString('<center><i class="folder outline icon"></i></center>');
						} else {
							return new Spacebars.SafeString('<center><i class="folder open outline icon"></i></center>');
						}
					}
				},
				{
					key: 'gembaWalk.name', 
					label: TAPi18n.__('gemba_walk'),
					sortable: true,
				},
				{
					key: 'date', 
					label: TAPi18n.__('date'),
					sortable: true,
					sortOrder: 0, 
					sortDirection: 'descending',
					fn(value) { 
						if (!value) {
							return TAPi18n.__('n_a');
						}
						return moment(value).format('MMM-DD-YYYY hh:mm A');
					}
				},
				{
					key: 'type', 
					label: TAPi18n.__('type'),
					fn(value) { 
						switch(value){
							case 1:
								return new Spacebars.SafeString(`<center>${TAPi18n.__('not_done')}</center>`);
							case 2:
								return new Spacebars.SafeString(`<center>${TAPi18n.__('late')}</center>`);
							case 3:
								return new Spacebars.SafeString(`<center>${TAPi18n.__('score_under')}</center>`);
							default:
								return new Spacebars.SafeString('<center>' + value + '</center>');
						}
					}
				},
				{
					key : 'flagged',
					label : TAPi18n.__('flagged'),
					sortable: true,
					fn(value) {
						if (value) {
							return new Spacebars.SafeString('<center><i class="flag icon"></i></center>');
						} else {
							return new Spacebars.SafeString('<center><i class="minus icon"></i></center>');
						}
					}
				},
				{
					key : '_id',
					label : TAPi18n.__('detail'),
					sortable: false,
					fn(value, object) {
						return new Spacebars.SafeString('<a href="#" id="goToReport" data-id="'+ value +'"><center>'
							+ object.messages.length + '<i class="comments icon"></i></center></a>');
					}
				}
			]
		};
	}

});
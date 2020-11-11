import Application from 'ember-drumming/app';
import config from 'ember-drumming/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();

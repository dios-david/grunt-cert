/*
 * grunt-cert
 * https://github.com/dios-david/grunt-cert
 *
 * Copyright (c) 2017 David Dios
 * Licensed under the Apache-2.0 license.
 */

'use strict';

var shelljs = require('shelljs'),
    uuidv4 = require('uuid/v4');

module.exports = function (grunt) {
    var COMMAND_PATTERN = 'openssl req -x509 -newkey rsa:4096 -keyout {{ locationKey }} -out {{ locationCert }} -subj \'/C={{ countryName }}/ST={{ state }}/L={{ city }}/O={{ organizationName }}/OU={{ organizationUnitName }}/CN={{ commonName }}/emailAddress={{ emailAddress }}\' -passout pass:{{ passPhrase }}';

    function CertificateGenerator() {
        this.locations = {
            key: './key.pem',
            cert: './cert.pem'
        };

        this.certData = {
            countryName: '',
            state: '',
            city: '',
            organizationName: '',
            organizationUnitName: '',
            commonName: '',
            emailAddress: ''
        };
    }

    CertificateGenerator.prototype = {
        setLocations: function (locations) {
            this.locations = Object.assign({}, this.locations, locations);
            return this;
        },

        setCertificateData: function (certData) {
            this.certData = Object.assign({}, this.certData, certData);
            return this;
        },

        generateCertificate: function () {
            if (this.validateCertData()) {
                var command = COMMAND_PATTERN,
                    vars = Object.assign({
                        locationKey: this.locations.key,
                        locationCert: this.locations.cert,
                        passPhrase: uuidv4()
                    }, this.certData);

                for (var i in vars) {
                    var regex = new RegExp('{{ ' + i + ' }}', 'g');

                    command = command.replace(regex, vars[i]);
                }

                grunt.log.writeln('Generating certification with openssl...');

                shelljs.exec(command);
            }
        },

        validateCertData: function () {
            if (this.certData.countryName.length > 2) {
                grunt.error.writeln('Country name should be no more than 2 characters long!');
                return false;
            }

            return true;
        }
    };


    grunt.registerMultiTask('cert', function () {
        new CertificateGenerator()
            .setLocations(this.data.locations)
            .setCertificateData(this.data.certData)
            .generateCertificate();
    });
};

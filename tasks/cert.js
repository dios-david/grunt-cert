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
    var TYPES = {
            CERT: 'cert',
            KEYS: 'private-public-keys'
        },
        KEYS_COMMAND_PATTERN_1 = 'openssl genrsa -out {{ locationPrivateKey }} {{ keySize }}',
        KEYS_COMMAND_PATTERN_2 = 'openssl rsa -pubout -in {{ locationPrivateKey }} -out {{ locationPublicKey }}',
        CERT_COMMAND_PATTERN = 'openssl req -x509 -newkey rsa:{{ keySize }} -keyout {{ locationKey }} -out {{ locationCert }} -subj \'/C={{ countryName }}/ST={{ state }}/L={{ city }}/O={{ organizationName }}/OU={{ organizationUnitName }}/CN={{ commonName }}/emailAddress={{ emailAddress }}\' -passout pass:{{ passPhrase }}';

    function CertificateGenerator() {
        this.mode = {
            type: TYPES.CERT,
            keySize: 4096
        },

        this.locations = {
            privateKey: './private-key.pem',
            publicKey: './public-key.pem',
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
        setMode: function(mode) {
            if(mode) {
                this.mode = Object.assign({}, this.mode, mode);
            }

            return this;
        },

        setLocations: function (locations) {
            this.locations = Object.assign({}, this.locations, locations);

            return this;
        },

        setCertificateData: function (certData) {
            if(certData) {
                this.certData = Object.assign({}, this.certData, certData);
            }

            return this;
        },

        generate: function() {
            if(this.mode.type === TYPES.CERT) {
                this.generateCertificate();
            } else if(this.mode.type === TYPES.KEYS) {
                this.generateKeys();
            } else {
                grunt.error.writeln('Type should be one of the followings: cert, private-public-keys');
            }
        },

        generateKeys: function() {
            var vars = {
                    locationPublicKey: this.locations.publicKey,
                    locationPrivateKey: this.locations.privateKey,
                    keySize: this.mode.keySize
                },
                command1 = this.parseCommand(KEYS_COMMAND_PATTERN_1, vars),
                command2 = this.parseCommand(KEYS_COMMAND_PATTERN_2, vars);

            grunt.log.writeln('Generating private key with openssl...');
            shelljs.exec(command1);

            grunt.log.writeln('Generating public key with openssl...');
            shelljs.exec(command2);
        },

        generateCertificate: function () {
            if (this.validateCertData()) {
                var vars = Object.assign({
                        locationKey: this.locations.key,
                        locationCert: this.locations.cert,
                        keySize: this.mode.keySize,
                        passPhrase: uuidv4()
                    }, this.certData),
                    command = this.parseCommand(CERT_COMMAND_PATTERN, vars);

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
        },

        parseCommand: function(command, vars) {
            for (var i in vars) {
                var regex = new RegExp('{{ ' + i + ' }}', 'g');

                command = command.replace(regex, vars[i]);
            }

            return command;
        }
    };


    grunt.registerMultiTask('cert', function () {
        new CertificateGenerator()
            .setMode(this.data.mode)
            .setLocations(this.data.locations)
            .setCertificateData(this.data.certData)
            .generate();
    });
};

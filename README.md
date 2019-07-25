grunt-cert
==========
Generates private keys and certificates in a Grunt task.

## Requirements
- openssl installed
- grunt installed


## Example Grunt configuration
```
module.exports = function(grunt) {
    grunt.initConfig({
        cert: {
            keys: {
                mode: {
                    type: 'private-public-keys',
                    keySize: 4096
                },
                locations: {
                    privateKey: './private-key.pem',
                    publicKey: './public-key.pem'
                }
            },
            cert: {
                encryptKey: true,
                mode: {
                    type: 'cert',
                    keySize: 4096
                },
                locations: {
                    key: './key.key',
                    cert: './cert.cert'
                },
                certData: {
                    countryName: 'HU',
                    state: 'Csongrad',
                    city: 'Szeged',
                    organizationName: 'FooBar Ltd',
                    organizationUnitName: 'Development',
                    commonName: 'FooBar CA',
                    emailAddress: 'foo@bar.fb'
                }
            }
        }
    });

    grunt.loadNpmTasks('.grunt-cert');
};
```

Contributors welcome!

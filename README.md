grunt-cert
==========
Generates private keys and certificates in a Grunt task.

##Requirements
- openssl installed
- grunt installed


##Example Grunt configuration
```
grunt.initConfig({
    certification: {
        cert: {
            locations: {
                key: './certs/key.key',
                cert: './certs/cert.cert'
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
```

Contributors welcome!
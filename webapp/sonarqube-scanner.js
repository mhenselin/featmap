const scanner = require('sonarqube-scanner');
scanner(
    {
        serverUrl: "http://localhost:9000",
        token: "sqa_a21dd5e05fc95a07ef065c29862f07884b93b9e3",
        options: {
            'sonar.sources': 'src',
        }
    },
    () => process.exit()
);
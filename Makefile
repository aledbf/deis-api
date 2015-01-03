TESTS = $(shell find test -name "*_test.js")

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha $(TESTS)

coverage:
	istanbul instrument --output lib-cov --no-compact --variable global.__coverage__ lib
	@COVER=1 ./node_modules/mocha/bin/mocha --reporter mocha-istanbul $(TESTS)

.PHONY: test coverage

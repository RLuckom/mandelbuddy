YUI({ logInclude: { TestRunner: true } }).use('test', 'test-console',
    function (Y) {
    	var test_ComplexEnoughNumber = new Y.Test.Case(
    		{
    			name: "Test Complex Enough Numbers",
    			testSimple: function() {
    				var complex1 = new ComplexEnoughNumber(1, 0);
    				var complex2 = complex1.plus(complex1);
    				Y.Assert.areSame(2, complex2.real,
    					"expected: 2, got: " + complex2.real);
    				Y.Assert.areSame(0, complex2.imag,
    					"expected: 0, got: " + complex2.real);
    				var complex1_1 = new ComplexEnoughNumber(1, 1);
    				var complex0_2 = complex1_1.squared();
    				Y.Assert.areSame(2, complex0_2.imag,
    					"expected: 2, got: " + complex0_2.imag);
    			}
    		}
    	);
    	
    	Y.Test.Runner.add(test_ComplexEnoughNumber);
    	
    	var test_InMandelSet = new Y.Test.Case(
    		{
    			name: "Test In Mandel Set",
    			testSimple: function() {
    				var m = new MandelBuddy(200, 300, 7);
    				var complex1 = ComplexEnoughNumber(1, 0);
    				var result = m.escapeTime(1, 0);
    				Y.Assert.areSame(2, result,
    					"expected: 2, got: " + result);
    			}
    		}
    	);
    	
    	Y.Test.Runner.add(test_InMandelSet);

    	(new Y.Test.Console({
    		newestOnTop: false
    	})).render('#log');
    	
    	Y.Test.Runner.run();
    });

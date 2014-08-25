<?php
namespace Devapt\tests\units\Core;

// REQUIRE DEVAPT, ZF2 AND ATOUM
require(__DIR__ . "/../../../autoload.php");

// USE ATOUM
use \atoum;

// TEST CLASS
class Types extends atoum
{
    /*
     * Types::__construct()
     */
    public function test__construct()
    {
		$this
			// SCALAR
			->boolean( false )
                ->isFalse()
		;
	}
	
	
    /*
     * Types::isAssoc()
     */
    public function testIsAssoc()
    {
        $this
			// SCALAR
			->boolean( \Devapt\Core\Types::isAssoc(null) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc(true) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc(false) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc(-1) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc(0) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc(1) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc('anything') )
                ->isFalse()
			
			// ARRAY
			->boolean( \Devapt\Core\Types::isAssoc( array() ) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc( array('aaa', 'bbb') ) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc( array('a'=>'aaa') ) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isAssoc( array('0'=>'aaa') ) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc( array('a'=>'aaa', 'b'=>'bbb') ) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isAssoc( array('0'=>'aaa', '1'=>'bbb') ) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isAssoc( array('0'=>'aaa', 'b'=>'bbb') ) )
                ->isTrue()
		;
	}
	
	
    /*
     * Types::toBoolean()
     */
    public function testToBoolean()
    {
        $this
			// CONVERT TO TRUE
			->boolean( \Devapt\Core\Types::toBoolean(true) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean(1) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean(123) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('1') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('123') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('true') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('True') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('TRUE') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('yes') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('y') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('YES') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('on') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('On') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('ON') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean('enabled') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean( array('a'), true ) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::toBoolean( $this, true ) )
                ->isTrue()
			
			// CONVERT TO FALSE
			->boolean( \Devapt\Core\Types::toBoolean(false) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean(null) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean(-1) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean(0) )
                ->isFalse()
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('-1') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('0') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('false') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('False') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('FALSE') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('no') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('No') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('NO') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('off') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('Off') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('OFF') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('disabled') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('none') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('None') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean('anything else') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean( array('a') ) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::toBoolean( $this ) )
                ->isFalse()
        ;
    }
	
	
    /*
     * Types::isBoolean()
     */
    public function testIsBoolean()
    {
        $this
			// CONVERT TO TRUE
			->boolean( \Devapt\Core\Types::isBoolean(true) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean(1) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean(123) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isBoolean('1') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('123') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isBoolean('true') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('True') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('TRUE') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('yes') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('y') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('YES') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('on') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('On') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('ON') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('enabled') )
                ->isTrue()
			
			// CONVERT TO FALSE
			->boolean( \Devapt\Core\Types::isBoolean(false) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean(null) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isBoolean(-1) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isBoolean(0) )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('-1') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isBoolean('0') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('false') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('False') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('FALSE') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('no') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('No') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('NO') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('off') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('Off') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('OFF') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('disabled') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('none') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('None') )
                ->isTrue()
			->boolean( \Devapt\Core\Types::isBoolean('anything else') )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isBoolean( array('a') ) )
                ->isFalse()
			->boolean( \Devapt\Core\Types::isBoolean( $this ) )
                ->isFalse()
        ;
    }
}
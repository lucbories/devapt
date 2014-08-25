<?php

// D:\DATAS\GitHub\DevApt\devapt-server\tests>php ..\dist\mageekguy.atoum.phar -f TestAtoum\tests\units\TestAtoum.php


// La classe de test à son propre namespace :
// Le namespace de la classe à tester + "tests\units"
namespace TestAtoum\tests\units;
 
// Vous devez inclure la classe à tester
require_once __DIR__ . '\..\..\..\TestAtoum\TestAtoum.php';
 
use \atoum;
 
/*
 * Classe de test pour \TestAtoum
 
 * Remarquez qu’elle porte le même nom que la classe à tester
 * et qu’elle dérive de la classe atoum
 */
class TestAtoum extends atoum
{
    /*
     * Cette méthode est dédiée à la méthode getHiAtoum()
     */
    public function testGetHiAtoum ()
    {
        // création d’une nouvelle instance de la classe à tester
        $helloToTest = new \TestAtoum\TestAtoum();
 
        $this
            // nous testons que la méthode getHiAtoum retourne bien
            // une chaîne de caractère...
            ->string($helloToTest->getHiAtoum())
                // ... et que la chaîne est bien celle attendue,
                // c’est-à-dire 'Hi atoum !'
                ->isEqualTo('Hi atoum !')
        ;
    }
}
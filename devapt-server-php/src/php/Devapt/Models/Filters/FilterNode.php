<?php
/**
 * @file        FilterNode.php
 * @brief       Filter node class
 * @details     ...
 * @see			...
 * @ingroup     MODELS
 * @date        2014-02-22
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Models\Filters;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Core\ITraceable;
use \Devapt\Security\DbConnexions;

// ZEND IMPORTS
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\Sql\Predicate\PredicateInterface;

class FilterNode implements ITraceable
{
	// STATIC ATTRIBUTES
	
	///@brief TRACE FLAG
	static public $TRACE_FILTER_NODE = false;
	
	static public $counter = 0;
	
	
	// ATTRIBUTES
	protected $id			= 0;
	protected $parent_node	= null;
	protected $combination	= null;
	protected $predicate	= null;
	protected $children		= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_parent_node		parent filter node (object)
	 * @param[in]	arg_combination		combination (string)
	 * @param[in]	arg_predicate		predicate (object)
	 * @return		nothing
	 */
	public function __construct($arg_parent_node, $arg_combination, $arg_predicate)
	{
		$context = 'FilterNode.constructor';
		Trace::step($context, 'Filter node created', self::$TRACE_FILTER_NODE);
		
		$this->id			= ++self::$counter;
		$this->parent_node	= $arg_parent_node;
		$this->combination	= $arg_combination;
		$this->predicate	= $arg_predicate;
	}
	

	public function trace()
	{
		return 'id=['.$this->id.'] children count=['.(is_array($this->children) ? count($this->children) : 'no child').'] has parent=['.(is_object($this->parent_node) ? 'true' : 'no parent').'] predicate=['.(is_object($this->predicate) ? get_class($this->predicate) : 'no predicate').'] combination=['.(is_string($this->combination) ? $this->combination : 'no combination').']';
	}
	
	public function getParentPredicate()
	{
		return is_object($this->parent_node) ? $this->parent_node->predicate : null;
	}
	
	public function getParent()
	{
		return $this->parent_node;
	}
	
	public function getParentCombination()
	{
		return is_object($this->parent_node) ? $this->parent_node->combination : null;
	}
	
	public function getPredicate()
	{
		return $this->predicate;
	}
	
	public function getCombination()
	{
		return $this->combination;
	}
	
	public function addChild($arg_filter_node)
	{
		$context = 'FilterNode.addChild';
		Trace::enter($context, '', self::$TRACE_FILTER_NODE);
		
		Trace::value($context, 'parent', $this, self::$TRACE_FILTER_NODE);
		Trace::value($context, 'child', $arg_filter_node, self::$TRACE_FILTER_NODE);
		
		
		// CHECK CHILD FILTER NODE
		if ( ! is_object($arg_filter_node) )
		{
			return Trace::leaveko($context, 'bad filter node', false, self::$TRACE_FILTER_NODE);
		}
		if ( ! $arg_filter_node->predicate instanceof PredicateInterface)
		{
			return Trace::leaveko($context, 'bad filter node predicate', false, self::$TRACE_FILTER_NODE);
		}
		
		// INIT CHILDREN ARRAY IF NEEDED
		if ( ! is_array($this->children) )
		{
			$this->children = array();
			
			// UPDATE PARENT COMBINATION IF NEEDED
			if ( is_object($this->parent_node) && is_null( $this->getCombination() ) )
			{
				$this->combination = $arg_filter_node->combination;
			}
		}
		
		// CHECK NODE PREDICATE
		if ( ! is_object($this->predicate) )
		{
			return Trace::leaveko($context, 'bad filter predicate', false, self::$TRACE_FILTER_NODE);
		}
		if ( ! $this->predicate instanceof PredicateSet)
		{
			Trace::value($context, 'node->predicate', $this->predicate, self::$TRACE_FILTER_NODE);
			Trace::value($context, 'child node->predicate', $arg_filter_node->predicate, self::$TRACE_FILTER_NODE);
			return Trace::leaveko($context, 'bad filter predicate: not a predicate', false, self::$TRACE_FILTER_NODE);
		}
		
		// ADD CHILD
		$this->children[]	= $arg_filter_node;
		$this->predicate->addPredicate($arg_filter_node->predicate, $arg_filter_node->combination);
		
		return Trace::leaveok($context, '', true, self::$TRACE_FILTER_NODE);
	}
}
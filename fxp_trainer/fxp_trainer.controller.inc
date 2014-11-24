<?php
/**
 * The class used for form message entities. 
 */
class FXPTrainer extends Entity {
  public $label; 
  public $status;
  public function __construct($values = array()) { 
    parent::__construct($values, 'fxp_trainer');
  } 
}
<?php
namespace API\V2;
require_once $_SERVER['DOCUMENT_ROOT'].'/api/v2/Api.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/api/v2/rule/RuleDAO.php';

class RuleEngine
{
    protected $ruleDAO;

    public function __construct()
    {
        //$this->ruleDAO = new RuleDAO();
    }

    public function applyRuleToMeasurement($sensorMeasurement, $mac) {
        if($this->isRuleOverflow($sensorMeasurement, $mac)){
            //TODO: Do something to handle rule overflow
        }
        if($this->isRuleUnderflow($sensorMeasurement, $mac)){
            //TODO: Do something to handle rule underflow
        }
    }

    public function isRuleOverflow($sensorMeasurement, $mac) {
        return false;
        $rules = $this->getRulesForRoom($mac);
        foreach ($rules as $rule){
            if($rule->type === $sensorMeasurement->type){
                return $rule->upperThreshold < $sensorMeasurement->value;
            }
        }
        return false;
    }

    public function isRuleUnderflow($sensorMeasurement, $mac) {
        return false;
        $rules = $this->getRulesForRoom($mac);
        foreach ($rules as $rule){
            if($rule->type === $sensorMeasurement->type){
                return $rule->lowerThreshold > $sensorMeasurement->value;
            }
        }
        return false;
    }

    public function getRulesForRoom($mac){
        return $this->ruleDAO->getRulesForRoom($mac);
    }
}
<?php
	class Template extends CORE{		
	    //必须，数据库加载启动 
	 	public function __construct(){CORE::dbStart();}
		public function __destruct(){CORE::dbClose();}
		public static function getInstance(){return CORE::init(get_class());}
		
		public function getStep(){
			return TEMPLATE_PAGE_STEP;
		}
		
		public function bountyRemove($index){

		}
		
		public function bountyAdd($hash,$data){

		}
		
		public function bountyView($hash){

		}
		public function bountyList($page=0,$step=TEMPLATE_PAGE_STEP){
			
		}
	}
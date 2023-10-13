//Get Program and Processor Information
program = require("./program.json");
dvMuse = context.devices.get('idevice');
dvMuse.online(function(event){
    log = context.log;
    log.info ("<!== PROCESSOR ONLINE ==!>");
    log.info("<!== STARTING:" + program.name.toUpperCase() + " == !>");

    /***************************************************/
    /*          DEVICE DEFINITIONS GO BELOW            */
    /***************************************************/
    
    //Hardware Ports
    dvRoomSensor    = dvMuse.io[0]; 
    dvPrivacyGlass  = dvMuse.relay[0]; 
    dvBluRay_IR     = dvMuse.ir[0];

    //User Interfaces
    dvTP   = context.devices.get('AMX-10003');

    //Serial Devices
    dvATSC = require("ATSC4_v1.js"); 
    dvVaddio = context.devices.get('dvCamera');

    //IP Control Devices
    dvPrecis = require("AMX-PR-WP-412.js");
    dvPrecis.init("precis-wp-412");
    dvDisplay = context.devices.get("dvSamsungQB75R");
    dvDisplay.module.setInstanceProperty("IP_Address","10.35.88.140");
    dvDisplay.module.reinitialize();
 
    //BSS Devices:
    dvBLU = context.devices.get("SoundwebLondonBLU-50-2");

    /***************************************************/
    /*          CONSTANT DEFINITIONS GO BELOW          */
    /***************************************************/
    const tp = [
        {
            "port":1,
            "buttons":[3],
            "levels":[2]
        },
        {
            "port":2,
            "buttons":[1,2,3,4,5],
            "levels":[]
        },
        {
            "port":3,
            "buttons":[1,2,3,4,5,6,7,44,45,46,47,48,49],
            "levels":[]
        },
        {
            "port":4,
            "buttons":[1,2,3,4,10,11,12,13,14,15,16,17,18,19,22,23,44,45,46,47,48,49,90,201,202,203,204,205,235],
            "levels":[]
        },
        {
            "port":5,
            "buttons":[24,25,26,100],
            "levels":[2]
        },
        {
            "port":6,
            "buttons":[21,22,45,46,47,48,116,117],
            "levels":[]
        }
    ];

    stb = {
        port:0,
        presets:{
            msnbc:"9",
            cnn:"33",
            foxnews:"144",
            bloomberg:"55",
            weather:"66"
        }
    
    };
    
  

    /***************************************************/
    /*          VARIABLE DEFINITIONS GO BELOW          */
    /***************************************************/
    vars = {};
    
    /***************************************************/
    /*                   FUNCTIONS                     */
    /***************************************************/

    const btnFunctions = function(event){
    
        var port = parseInt(event.path.split('/')[1]);
        var btn  = parseInt(event.id);
        var state = event.value;
        log.info("[BTN] Port = " + port + ', Button = ' + btn + ', State =' + state);
        switch(port){  //Gets Port Value.
            default:{
                context.log.info("PORT:" + port + " = NO ASSOCIATED PROGRAMMING");
            }
            case(1):{
                switch(state){  //Gets Pushed/Release
                    case(true):{
                        switch(btn){ //Gets Button Number
                            default:{log.info("No Programmed Event for Port:" + port + "Button:" + btn); break;}
                            case(3):{
                                dvPrivacyGlass.state = !dvPrivacyGlass.state.value; //toggles true/false.
                                break;
                            }
                        }
                        break;
                    }    
                    case(false):{
                        break;
                    }
                }
                break;
            }
            case(2):{
                switch(state){
                    case(true):{
                        //Room Power State
                        switch(btn){
                            default:{
                                room.on();
                                break;
                            }
                            case(5):{
                                room.off();
                                break;
                            }
                        }
                    
                        //Set Precis Switcher
                        switch(btn){
                            case(1):{dvPrecis.switch(3);break}
                            case(2):{dvPrecis.switch(1);break}
                            case(3):{dvPrecis.switch(4);break}
                            case(4):{dvPrecis.switch(2);break}
                            case(5):{dvPrecis.switch(0); break;} //Clears the In to Output
                            default:{dvPrecis.switch(btn); break;} //Sets Precis to Input that Matches Button Number.
                        }
                                            
                        //Touch Panel Pop Up Set:
                        switch(btn){
                            case(2):{
                                dvTP.port[1].send_command("^PGE-Main");
                                dvTP.port[1].send_command("^PPN-[LPS]Laptop1");
                                break;
                            }
                            case(4):{
                                dvTP.port[1].send_command("^PGE-Main");
                                dvTP.port[1].send_command("^PPN-[LPS]Laptop2");
                                break;
                            }
                            case(1):{
                                dvTP.port[1].send_command("^PGE-Main");
                                dvTP.port[1].send_command("^PPN-[LPS]DVD");
                                dvBluRay_IR.clearAndSendIr(9);
                                break;
                            }
                            case(3):{
                                dvTP.port[1].send_command("^PGE-Main");
                                dvTP.port[1].send_command("^PPN-[LPS]Tuner");
                                dvMuse.serial[stb.port].send(dvATSC.key("power"));
                                break;
                            }
                            case(5):{
                                dvTP.port[1].send_command("^PGE-Logo");
                                dvTP.port[1].send_command("^PPX");
                                break;
                            }
                            
                        } 
                        break;
                    }
                    case(false):{
                        //No release events.
                        break;
                    }
                }   
                break;    
            }
            case(3):{
                switch(state){
                    case(true):{
                        switch (btn){
                            default:{
                                dvBluRay_IR.clearAndSendIr(btn);
                                break;
                            }
                        }
                        break;
                    }
                    case(false):{
                        //No Release Events.
                        break;
                    }
                }
    
                break;
            }
            case(4):{
                switch(state){
                    case(true):{
                        switch (btn){
                            case(9):{dvMuse.serial[stb.port].send(dvATSC.key("power")); break}
                            case(44):{dvMuse.serial[stb.port].send(dvATSC.key("menu")); break}
                            case(101):{dvMuse.serial[stb.port].send(dvATSC.key("info")); break}
                            case(105):{dvMuse.serial[stb.port].send(dvATSC.key("guide")); break}
                            case(50):{dvMuse.serial[stb.port].send(dvATSC.key("exit")); break}
    
                            case(45):{dvMuse.serial[stb.port].send(dvATSC.key("up")); break}
                            case(46):{dvMuse.serial[stb.port].send(dvATSC.key("down")); break}
                            case(47):{dvMuse.serial[stb.port].send(dvATSC.key("left")); break}
                            case(48):{dvMuse.serial[stb.port].send(dvATSC.key("right")); break}
                            case(49):{dvMuse.serial[stb.port].send(dvATSC.key("select")); break}
    
                            case(11):{dvMuse.serial[stb.port].send(dvATSC.key("digit_1")); break}
                            case(12):{dvMuse.serial[stb.port].send(dvATSC.key("digit_2")); break}
                            case(13):{dvMuse.serial[stb.port].send(dvATSC.key("digit_3")); break}
                            case(14):{dvMuse.serial[stb.port].send(dvATSC.key("digit_4")); break}
                            case(15):{dvMuse.serial[stb.port].send(dvATSC.key("digit_5")); break}
                            case(16):{dvMuse.serial[stb.port].send(dvATSC.key("digit_6")); break}
                            case(17):{dvMuse.serial[stb.port].send(dvATSC.key("digit_7")); break}
                            case(18):{dvMuse.serial[stb.port].send(dvATSC.key("digit_8")); break}
                            case(19):{dvMuse.serial[stb.port].send(dvATSC.key("digit_9")); break}
                            case(90):{dvMuse.serial[stb.port].send(dvATSC.key("dash")); break}
                            case(10):{dvMuse.serial[stb.port].send(dvATSC.key("digit_0")); break}
                            case(21):{dvMuse.serial[stb.port].send(dvATSC.key("enter")); break}
    
                            case(22):{dvMuse.serial[stb.port].send(dvATSC.key("channel+")); break}
                            case(23):{dvMuse.serial[stb.port].send(dvATSC.key("channel-")); break}
                            case(235):{dvMuse.serial[stb.port].send(dvATSC.key("last")); break}
    
                            case(201): {dvMuse.serial[stb.port].send(dvATSC.set.channel(stb.presets.cnn)); break}
                            case(202): {dvMuse.serial[stb.port].send(dvATSC.set.channel(stb.presets.msnbc)); break}   
                            case(203): {dvMuse.serial[stb.port].send(dvATSC.set.channel(stb.presets.foxnews)); break}
                            case(204): {dvMuse.serial[stb.port].send(dvATSC.set.channel(stb.presets.bloomberg)); break}
                            case(205): {dvMuse.serial[stb.port].send(dvATSC.set.channel(stb.presets.bloomberg)); break}
                        }  
                        break;
                    }
                    case(false):{
                        //No Release Events
                        break;
                    }
                }

                break;
            }
            case(5):{
                dvTP.port[5].channel[btn].value = state; //Sets Button Feedback;
                switch(state){
                    case(true):{
                        switch(btn){
                            case(24):{
                                dvBLU.Audio.NodeRed_Output_Gain["Bump Up"].value = "On";
                                break;
                            }
                            case(25):{
                                dvBLU.Audio.NodeRed_Output_Gain["Bump Down"].value = "On";
                                break;
                            }
                            case(26):{
                                dvBLU.Audio["Main Volume"]["Override Mute"].value = (dvBLU.Audio["Main Volume"]["Override Mute"].value == "Muted") ? "Unmuted" : "Muted";
                                break;
                            }
                            case(100):{
                                dvBLU.Audio["Mic Gain"].Mute.value = (dvBLU.Audio["Mic Gain"].Mute.value == "Muted") ? "Unmuted" : "Muted";
                                break;
                            }
                        }
                        break;
                    }
                    case(false):{
                        switch(btn){
                            case(24):{dvBLU.NodeRed_Output_Gain["Bump Up"].value = "Off";break}
                            case(25):{dvBLU.NodeRed_Output_Gain["Bump Down"].value = "Off";break}
                        }

                        break;
                    }
                }
                break;
            }
            case(6):{
                dvTP.port[6].channel[btn].value = state;
                switch(state){
                    case(true):{
                        switch(btn){
                            case(45): {dvVaddio.camera[0].tiltRamp.value = "UP";break;}
                            case(46): {dvVaddio.camera[0].tiltRamp.value = "DOWN";break;}
                            case(47): {dvVaddio.camera[0].panRamp.value = "LEFT";  break;}
                            case(48): {dvVaddio.camera[0].panRamp.value = "RIGHT";;break;}
                            case(116):{dvVaddio.camera[0].zoomRamp.value = "IN";break;}
                            case(117):{dvVaddio.camera[0].zoomRamp.value = "OUT";break;}
                            case(21): {dvVaddio.camera[0].preset.value = "1";break;}
                            case(22): {dvVaddio.camera[0].preset.value = "2";break;}
                        }
                        break;
                    }
                    case(false):{
                        
                        switch(btn){
                        
                            case(45):  
                            case(46):  {dvVaddio.camera[0].tiltRamp.value = "STOP"; break}
                            case(47):  
                            case(48):  {dvVaddio.camera[0].panRamp.value  = "STOP"; break}
                            case(116): 
                            case(117): {dvVaddio.camera[0].zoomRamp.value = "STOP"; break}
                        
                            case (21):
                            case (22):{
                                //do nothing
                                break;
                            }
                        }
                        break;
                    }
                }
                break;
            }
        }
    
    }
    const lvlFunctions = function(event){
        log.info("[LVL] Level = " + event.id + ", Value = " + event.value);
    }
    
    const room = {
        timer:context.services.get("timeline"),
        delay:10000, //Time in MS
        off:function(){
            log.info("<!== STARTING ROOM OFF TIMER ==!>");
            this.timer.start([this.delay]);
        },
        on:function(){
            log.info("<!== CANCEL ROOM OFF EVENT ==!>");
            dvDisplay.lamp[0].power.value = "ON";
            
            this.timer.stop();
        }
    }
    const  padWithZero = function(str){
        (str.length == 1) ? str = "0" + str : str = str;
        (str.length == 2) ? str = "0" + str : str = str;
        return str;
    }


    /***************************************************/
    /*                   EVENTS - ONLINE               */
    /***************************************************/

    dvDisplay.online(function(event){
        log.info("<!== DISPLAY IS ONLINE! ==!>");
    });

    dvTP.online(function(){
        log.info("<!== TOUCHPANEL ONLINE ==!>");
        tp.forEach(function(e){
            e.buttons.forEach(function(b){
                dvTP.port[e.port].button[b].watch(function(event){
                    btnFunctions(event);
                });
            })
            e.levels.forEach(function(b){
                dvTP.port[e.port].level[b].watch(lvlFunctions);
            })
        })
    });

    dvBLU.online(function(){
        log.info("<!== BLU ONLINE ==!>");
        dvBLU.Audio.NodeRed_Output_Gain.Gain.watch(function(event){
            let min = -80;
            let max = 10;
            let val = Math.floor(parseInt(255*(event.newValue - min)/(max - min)));
            dvTP.port[1].level[2].value = val;
        });
        dvBLU.Audio["Main Volume"]["Override Mute"].watch(function(event){
            dvTP.port[5].channel[26].value = (event.newValue == "Muted") ? true : false;
        });
        dvBLU.Audio["Mic Gain"].Mute.watch(function(event){
            dvTP.port[5].channel[100].value = (event.newValue == "Muted") ? true : false;
        });
    })

    /***************************************************/
    /*       EVENTS - LISTEN/WATCH/CHANGE              */
    /***************************************************/

    //CAMERA CONTROLS
    dvVaddio.camera[0].preset.watch(function(event){
        dvTP.port[6].channel[21].value = (event.newValue == 1);
        dvTP.port[6].channel[22].value = (event.newValue == 2);
    });

    dvVaddio.camera[0].zoomSpeed.value = 32
    dvVaddio.camera[0].panSpeed.value = 32
    dvVaddio.camera[0].tiltSpeed.value = 32

    //ATSC CONTROLS
    dvMuse.serial[stb.port].receive.listen(function(event){
        dvATSC.response(String(event.arguments.data));
    });

    dvATSC.status.listen = function(){
        dvTP.port[1].send_command("^TXT-400,0," + dvATSC.status.channel.major);
     };
     
    //IO: 
    dvRoomSensor.digitalInput.watch(function(event) {           
        if (event.value) {  //TRUE = Room Occupied;
            room.on();
        } else if (!event.false) { //FALSE = Room Unoccupied;
            room.off();
        }
    });

    //RELAY:
    dvPrivacyGlass.state.watch(function(event){
        dvTP.port[1].channel[3].value = event.newValue;
    });

    //PRECIS
    dvPrecis.onChange = function(){
        
        dvTP.port[2].channel[1].value = (dvPrecis.output[0].video == 3);
        dvTP.port[2].channel[2].value = (dvPrecis.output[0].video == 1); 
        dvTP.port[2].channel[3].value = (dvPrecis.output[0].video == 4);
        dvTP.port[2].channel[4].value = (dvPrecis.output[0].video == 2);

        dvTP.port[2].channel[102].value = dvPrecis.input[0].signal;
        dvTP.port[2].channel[104].value = dvPrecis.input[1].signal;
        dvTP.port[2].channel[101].value = dvPrecis.input[2].signal;
        dvTP.port[2].channel[103].value = dvPrecis.input[3].signal;
    }

    /***************************************************/
    /*                  TIMELINES                      */
    /***************************************************/

   
    //Room Off Event
    room.timer.expired.listen(function(){
        log.info("<!== EXECUTING ROOM OFF - TIME ==!>");
        dvPrecis.switch(0);
        dvDisplay.lamp[0].power.value = "OFF";
        room.timer.stop();
    });

    

    
});
document.querySelectorAll("#addr-modes").checked = false;

      // HEX VALIDATION
      function hexvalidate() {
        let formdata = document.querySelectorAll(".reg");
        let regArr = Array.from(formdata);

        let regExp = new RegExp(/^[0-9A-F]{1,2}$/i);
        for (let i = 0; i < regArr.length; i++) {
          if (!regExp.test(regArr[i].value)) {
            alert ("Proszę wypełnić rejestry liczbami w systemie szesnastkowym - cyfry 0-9 i/lub znaki A-F");
            document.querySelector(".main-ops").style.setProperty("display", "none");
          } else {
            document.querySelector(".main-ops").style.setProperty("display", "flex");
          }
        }
      }

      function clearHistory() {
        document.querySelector("#history-list").innerHTML = "";
      }

      function showComp(id) {
        document.querySelector(id).style.setProperty("display", "block");  
      }

      function hideComps(id1, id2, id3) {
        document.querySelector(id1).style.setProperty("display", "none");  
        document.querySelector(id2).style.setProperty("display", "none");  
        document.querySelector(id3).style.setProperty("display", "none");  
      }
      // GET VALUE OF A REGISTER
      function getValue(id) {
        let valueId = id.substring(id.length - 2, id.length);
        let regValue = "";
        // console.log("valueID "+valueId);

        //IF REGISTER HAS AN X
        if (valueId.charAt(1) === "x") {
          let firstLetter = valueId.charAt(0);
          let valueH = "";
          let valueL = "";

          if (id.substring(1, 5) === "from") {
            valueL = getValue("#from-" + firstLetter + "l");
            valueH = getValue("#from-" + firstLetter + "h");
          } else {
            valueL = getValue("#to-" + firstLetter + "l");
            valueH = getValue("#to-" + firstLetter + "h");
          }
          regValue = valueH.concat(valueL);
          // console.log(regValue);
        } else {
          regValue = document.querySelector("#" + valueId).value;
        }

        // console.log(id.substring(1,5));
        if (id.substring(1, 5) === "from") {
          document.querySelector("#from-reg").innerHTML =
            valueId.toUpperCase() + " - " + regValue;
        } else {
          document.querySelector("#to-reg").innerHTML =
            valueId.toUpperCase() + " - " + regValue;
        }
        // console.log(regValue);

        return regValue;
      }

      function getValueFrom2(id) {
        let split = id.split("+");
        // console.log(split);
        let returnValue;
        
        let value1 = document.querySelector("#"+split[1]).value;
        // console.log(value1);
        let value2 = document.querySelector("#"+split[2]).value;
        // console.log(value2);
        returnValue = value1 +" + "+ value2;
        // console.log(returnValue);

        // console.log(id.substring(1,5));
        let valueId = id.substring(id.length-5, id.length);
        document.querySelector("#to-reg").innerHTML = valueId.toUpperCase() + " - " + returnValue;
        
        return returnValue;
      }

      // FETCH DATA FOR MOV AND XCHG
      function fetchData() {
        let from = document.querySelector("#from-reg").innerHTML;
        // console.log("from.length: "+from.length);
        // console.log("from: "+from);

        let split = from.split(" - ");
        // console.log(split);

        let fromValue = split[1];
        let fromId = from.substring(0, 2);
        let fromIdLower = fromId.toLowerCase();
        // console.log(from);
        // console.log(fromValue);
        // console.log(fromId);
        let to = document.querySelector("#to-reg").innerHTML;
        let toValue = to.substring(to.length - 2, to.length);
        let toId = to.substring(0, 2);
        let toIdLower = toId.toLowerCase();

        let results = [fromValue, fromId, toId, toIdLower, fromIdLower, toValue];

        return results;
      }

      function fetchDataFrom2() {
        let from = document.querySelector("#from-reg").innerHTML;
        // console.log("from.length: "+from.length);
        // console.log("from: "+from);

        let split = from.split(" - ");
        // console.log(split);

        let fromValue = split[1];
        let fromId = from.substring(0, 2);
        let fromIdLower = fromId.toLowerCase();
        // console.log(from);
        // console.log(fromValue);
        // console.log(fromId);
        let to = document.querySelector("#to-reg").innerHTML;
        let toValue = to.substring(to.length - 5, to.length);
        let toId = to.substring(0, 5);
        let toIdLower = toId.toLowerCase();

        let results = [fromValue, fromId, toId, toIdLower, fromIdLower, toValue];

        return results;
      }

      function loadToX(fromValue, toIdLower) {
        // console.log("toValue: "+fromValue);
        let valueH = fromValue.substring(0,2);
        let valueL = fromValue.substring(2);
        let firstLetter = toIdLower.charAt(0);
        // console.log(valueH);
        // console.log(valueL);

        document.querySelector("#" + firstLetter + "h").value = valueH;
        document.querySelector("#" + firstLetter + "l").value = valueL;
        // console.log("H "+document.querySelector("#" + firstLetter + "h").value);
        // console.log("L "+document.querySelector("#" + firstLetter + "l").value);
      }

      // Text to hex value
      function text2hex(x) {
        return parseInt(x, 16);
      }

      function hex2text(x) {
        return x.toString(16).toUpperCase();
      }

      function calcAddr(addr, disp) {
        let hexAddr = text2hex(addr);
        let dispAddr = text2hex(disp);
        let result = hexAddr + dispAddr;

        return hex2text(result);
      }

      // MOV
      function mov() {
        let results = fetchData(),
          valueL,
          valueH;
        let addrMode = document.querySelector('input[name="addr"]:checked').value;
        // console.log(addrMode);

        // for(let i = 0; i < results.length; i++) {
        //     console.log(i+": "+results[i]);
        // }

        switch (addrMode) {
          case "direct":
            if (results[4].charAt(1) == "x") {
              loadToX(results[0], results[3]);
            } else {
              document.querySelector("#" + results[3]).value = results[0];
            }
            document.querySelector("#history-list").innerHTML +=
              "<li>MOV " + results[2] + ", " + results[1] + "</li>";
            break;
          case "index":
          case "base":
            if (
              document.querySelector('input[name="reg-dir"]:checked').value ===
              "reg2mem"
            ) {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV [" +
                  results[2] +
                  " + DISP], " +
                  results[1] +
                  "</li>";
              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV " + results[2] + ", " + results[1] + "</li>";
              }
            } else {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV " +
                  results[1] +
                  ", [" +
                  results[2] +
                  " + DISP]</li>";

                  disp = text2hex(document.querySelector("#disp").value);
                  val = text2hex(results[5]);
                  let calcAddress = calcAddr(val, disp);
                  // console.log(calcAddress);
                  // console.log(results[4]);

                  loadToX(calcAddress, results[4]);

              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV " + results[1] + ", " + results[2] + "</li>";
                  if (results[4].charAt(1) == "x") {
                    loadToX(results[0], results[3]);
                  } else {
                    document.querySelector("#" + results[1]).value = results[0];
                  }
              }
            }
            break;
            case "index-base":
                results = fetchDataFrom2();
                // for(let i = 0; i < results.length; i++) {
                //     console.log(i+": "+results[i]);
                // }
                if (
              document.querySelector('input[name="reg-dir"]:checked').value ===
              "reg2mem"
            ) {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV [" +
                  results[2] +
                  " + DISP], " +
                  results[1] +
                  "</li>";
              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV " + results[2] + ", " + results[1] + "</li>";
              }
            } else {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV " +
                  results[1] +
                  ", [" +
                  results[2] +
                  " + DISP]</li>";

                  disp = text2hex(document.querySelector("#disp").value);
                  val = text2hex(results[5]);
                  let calcAddress = calcAddr(val, disp);
                  // console.log(calcAddress);
                  // console.log(results[4]);
                  loadToX(calcAddress, results[4]);

              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>MOV " + results[1] + ", " + results[2] + "</li>";
              }
            }
            break;
        }
      }
      // XCHG
      function xchg() {
        let results = fetchData();
        let temp = "";
        let addrMode = document.querySelector('input[name="addr"]:checked').value;

        switch (addrMode) {
          case "direct":
            if (results[4].charAt(1) == "x") {
              let firstLetterTo = results[3].charAt(0);
              let firstLetterFrom = results[4].charAt(0);
              // console.log(firstLetterFrom);
              temp = document.querySelector("#" + firstLetterTo + "h").value;
              document.querySelector(
                "#" + firstLetterTo + "h"
              ).value = document.querySelector(
                "#" + firstLetterFrom + "h"
              ).value;
              document.querySelector("#" + firstLetterFrom + "h").value = temp;

              temp = document.querySelector("#" + firstLetterTo + "l").value;
              document.querySelector(
                "#" + firstLetterTo + "l"
              ).value = document.querySelector(
                "#" + firstLetterFrom + "l"
              ).value;
              document.querySelector("#" + firstLetterFrom + "l").value = temp;
            } else {
              temp = document.querySelector("#" + results[4]).value;
              document.querySelector(
                "#" + results[4]
              ).value = document.querySelector("#" + results[3]).value;
              document.querySelector("#" + results[3]).value = temp;
            }
            document.querySelector("#history-list").innerHTML +=
              "<li>XCHG " + results[2] + ", " + results[1] + "</li>";
            break;
          case "index":
          case "base":
            if (
              document.querySelector('input[name="reg-dir"]:checked').value ===
              "reg2mem"
            ) {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG [" +
                  results[2] +
                  " + DISP], " +
                  results[1] +
                  "</li>";
              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG " + results[2] + ", " + results[1] + "</li>";
              }
            } else {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG " +
                  results[1] +
                  ", [" +
                  results[2] +
                  " + DISP]</li>";
              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG " + results[1] + ", " + results[2] + "</li>";
              }
            }
            break;
        
            case "index-base":
                results = fetchDataFrom2();
                // for(let i = 0; i < results.length; i++) {
                //     console.log(i+": "+results[i]);
                // }
                if (
              document.querySelector('input[name="reg-dir"]:checked').value ===
              "reg2mem"
            ) {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG [" +
                  results[2] +
                  " + DISP], " +
                  results[1] +
                  "</li>";
              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG " + results[2] + ", " + results[1] + "</li>";
              }
            } else {
              if (document.querySelector("#disp-check").checked === true) {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG " +
                  results[1] +
                  ", [" +
                  results[2] +
                  " + DISP]</li>";
              } else {
                document.querySelector("#history-list").innerHTML +=
                  "<li>XCHG " + results[1] + ", " + results[2] + "</li>";
              }
            }
            break;
          case "default":
            console.log("Address mode error!");
        }
      }
      let regArray = new Array;
      function push() {
        let reg = document.querySelector("#choose-reg").value;
        let upperReg = reg.toUpperCase();
        regArray.push(upperReg);
        // console.log(upperReg);
        document.querySelector("#history-list").innerHTML += "<li class='stack-el'>PUSH " + upperReg + "</li>";
        document.querySelector("#stack-list").innerHTML = "";
        for(let i = regArray.length-1; i >= 0; i--) {
          document.querySelector("#stack-list").innerHTML += "<li class='stack-list-el'>" + regArray[i] + "</li>";
        }
        let sp = document.querySelector("#sp").value;
        // console.log(sp);
        let spParsed = parseInt(sp, 16);
        // console.log(spParsed);
        spParsed += 2;
        sp = spParsed.toString(16);
        // console.log(sp);
        let spUpper = sp.toUpperCase();
        document.querySelector("#sp").value = spUpper;
      }

      function pop() {
        let reg = document.querySelector("#choose-reg");
        // console.log(reg.value);
        document.querySelector("#history-list").innerHTML += "<li class='stack-el'>POP " + reg.value.toUpperCase()  + "</li>";
        let regValue = getValue("#"+reg.value);
        let pushVar = getValue("#"+regArray[0].toLowerCase());
        // console.log(regValue);
        
        if (reg.value.charAt(1) == "x") {
              valueH = pushVar.substring(0, 2);
              valueL = pushVar.substring(2);
              // console.log(valueH);
              // console.log(valueL);
              let firstLetter = reg.value.charAt(0);
              // console.log(firstLetter);
              document.querySelector("#" + firstLetter + "h").value = valueH;
              // console.log(document.querySelector("#" + firstLetter + "h").value);
              document.querySelector("#" + firstLetter + "l").value = valueL;
            } else {
              document.querySelector("#" + reg.value).value = pushVar;
            }

        regArray.pop();
        document.querySelector("#stack-list").innerHTML = "";
        for(let i = regArray.length-1; i >= 0; i--) {
          document.querySelector("#stack-list").innerHTML += "<li class='stack-list-el'>" + regArray[i] + "</li>";
        }

        let sp = document.querySelector("#sp").value;
        // console.log(sp);
        let spParsed = parseInt(sp, 16);
        // console.log(spParsed);
        spParsed -= 2;
        sp = spParsed.toString(16);
        // console.log(sp);
        let spUpper = sp.toUpperCase();
        document.querySelector("#sp").value = spUpper;
      }
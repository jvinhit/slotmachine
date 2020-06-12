var listEmp = [
  {
    CODE: 4219,
    NAME: "Trần Thu Hiền"
  },
  {
    CODE: 2816,
    NAME: "Mai Thanh Huyền"
  },
  {
    CODE: 6798,
    NAME: "Nguyễn Hải Linh"
  },
  {
    CODE: 6457,
    NAME: "Vũ Khắc Việt"
  },
  {
    CODE: 6628,
    NAME: "Mai Lâm Huy Bình"
  },
  {
    CODE: 6332,
    NAME: "Dương Minh Quang"
  },
  {
    CODE: 5711,
    NAME: "Mai Đình Nhất"
  },
  {
    CODE: 5478,
    NAME: "Khưu Lê Tuấn Anh"
  },
  {
    CODE: 6768,
    NAME: "Phạm Huy Đăng"
  },
  {
    CODE: 6775,
    NAME: "Phạm Xuân Thiện"
  },
  {
    CODE: 4944,
    NAME: "Hồ Khôi Nguyên"
  },
  {
    CODE: 6102,
    NAME: "Nguyễn Thanh Huyền"
  },
  {
    CODE: 5944,
    NAME: "Phan Đức Sơn"
  },
  {
    CODE: 3029,
    NAME: "Lê Thanh Cần"
  },
  {
    CODE: 6455,
    NAME: "Nguyễn Minh Công"
  },
  {
    CODE: 6773,
    NAME: "Trần Chinh"
  },
  {
    CODE: 5886,
    NAME: "Nguyễn Thiện Chí"
  },
  {
    CODE: 4283,
    NAME: "Đỗ Hữu Phúc"
  },
  {
    CODE: 2681,
    NAME: "Lương Thị Quế Chi"
  },
  {
    CODE: 6689,
    NAME: "Lê Thị Thủy Trang"
  },
  {
    CODE: 6685,
    NAME: "ĐINH THỊ NHUNG"
  },
  {
    CODE: 6333,
    NAME: "Nguyễn Văn Duyên"
  },
  {
    CODE: 6730,
    NAME: "Vũ Mạnh Hùng"
  },
  {
    CODE: 6458,
    NAME: "Hoàng Văn Thái"
  }
];

function randomIntFromInterval(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

$(document).ready(function () {
    var completed = 0,
        imgHeight = 700,
        posArr = [0, 70, 140, 210, 280, 350, 420, 490, 560, 630], // [1,2,3,4,5,6,7,8,9,0]
        posMapping = [1, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    /**
     * @class Slot
     * @constructor
     */
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot
        this.finalIndex = null;
        $(el).pan({
            fps: 60,
            dir: "down",
        });
        $(el).spStop();
    }

    /**
     * @method start
     * Starts a slot
     */
    Slot.prototype.start = function () {
        var _this = this;
        $(_this.el).addClass("motion");
        $(_this.el).spStart();
        _this.si = window.setInterval(function () {
            if (_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100);
    };

    /**
     * @method stop
     * Stops a slot
     */
    Slot.prototype.stop = function () {
        var _this = this,
            limit = 30;
        clearInterval(_this.si);
        _this.si = window.setInterval(function () {
            if (_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
            if (_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                $(_this.el).removeClass("motion");
                _this.speed = 0;
            }
        }, 100);
    };

    /**
     * @method finalPos
     * Finds the final position of the slot
     */
    Slot.prototype.finalPos = function () {
        var el = this.el,
            el_id,
            pos,
            posMin = 2000000000,
            best,
            bgPos,
            i,
            j,
            k;

        el_id = $(el).attr("id");
        //pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(" ")[1];
        pos = parseInt(pos, 10);

        for (i = 0; i < posArr.length; i++) {
            for (j = 0; ; j++) {
                let resultindex = this.finalIndex !== null ? this.finalIndex : i;
                k = posArr[resultindex] + imgHeight * j;
                if (k > pos) {
                    if (k - pos < posMin) {
                        posMin = k - pos;
                        best = k;
                        this.pos = posArr[i]; //update the final position of the slot
                        console.log("%c ! " + this.finalIndex, "background: #222; color: #bada55");
                    }
                    break;
                }
            }
        }

        best += imgHeight + 4;
        bgPos = "0 " + best + "px";
        console.log("%c bgPos! " + bgPos, "background: #222; color: #bada55");
        $(el).animate(
            {
                backgroundPosition: "(" + bgPos + ")",
            },
            {
                duration: 200,
                complete: function () {
                    completed++;
                },
            }
        );
    };

    /**
     * @method reset
     * Reset a slot to initial state
     */
    Slot.prototype.reset = function () {
        var el_id = $(this.el).attr("id");
        $._spritely.instances[el_id].t = 0;
        $(this.el).css("background-position", "0px 4px");
        this.speed = 0;
        completed = 0;
        $("#result").html("");
    };

    function enableControl() {
        $("#control").attr("disabled", false);
    }

    function disableControl() {
        $("#control").attr("disabled", true);
    }

    function printResult() {
        // var res;
        // if (win[a.pos] === win[b.pos] && win[a.pos] === win[c.pos]) {
        //   res = "You Win!";
        // } else {
        //   res = "You Lose";
        // }
        // $("#result").html(res);
    }

    //create slot objects
    const a = new Slot("#slot1", 40, 1),
        b = new Slot("#slot2", 50, 2),
        c = new Slot("#slot3", 60, 3),
        d = new Slot("#slot4", 70, 4);

    /**
     * Slot machine controller
     */
    $("#control").click(function () {
        disableControl();
        let x;
        const selectedPerson = randomIntFromInterval(0, listEmp.length-1);
        const  selectedCode = listEmp[selectedPerson].CODE.toString();
        const  selectedName = listEmp[selectedPerson].NAME.toString();

        if (selectedCode) {
                const [aa, bb, cc, dd] = selectedCode;
                a.finalIndex = posMapping.findIndex((item) => item === parseInt(aa));
                b.finalIndex = posMapping.findIndex((item) => item === parseInt(bb));
                c.finalIndex = posMapping.findIndex((item) => item === parseInt(cc));
                d.finalIndex = posMapping.findIndex((item) => item === parseInt(dd));
        }

        a.start();
        b.start();
        c.start();
        d.start();
        // auto sto
        for (let i = 1; i < 5; i++) {
            setTimeout(() => {
                i === 1 && a.stop();
                i === 2 && b.stop();
                i === 3 && c.stop();
                i === 4 && d.stop();
            }, i * 500 + 3000);
        }
        x = window.setInterval(function () {
            if ( a.speed === 0 && b.speed === 0 && c.speed === 0 && d.speed === 0 ) {
              Swal.fire(
                'Xin Chúc Mừng',
                `[${selectedCode}] - ${selectedName }`,
                'success'
              );
                setTimeout(() =>  enableControl(), 2000)
                window.clearInterval(x);
            }
        }, 100);
    });
});

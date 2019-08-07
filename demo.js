'use strict';
'use Math';

var monk = angular.module('monk', ['rzModule']);
var tactic_path='../../tactic/tactic/';
monk.controller('monkController', [
    '$scope', '$http', '$q', 'app_service', 'monkserve', 'fut_highchart_log', 'highchartlog',
    'H_title', 'H_legend', 'H_tooltip', 'H_credits', 'H_plotOptions', 'H_rangeSelector',
    'H_series', 'H_yAxis', 'H_chart', 'H_noData', 'H_theme',
    function($scope, $http, $q, app_service, monkserve, fut_highchart_log, highchartlog,
        H_title, H_legend, H_tooltip, H_credits, H_plotOptions, H_rangeSelector,
        H_series, H_yAxis, H_chart, H_noData, H_theme,) {
        $scope.bsmodels = {//X軸選項
            1: '現貨價格',
            2: '履約價格',
            3: '存續期間',
            4: '利 率',
            5: '波動度'
        };
        $scope.greeks = {
            1: 'Delta',
            2: 'Gamma',
            3: 'Vega',
            4: 'Theta',
            5: 'Rho'
        };
        $scope.btmodels = {
            1: '現貨價格',
            2: '履約價',
            3: '存續期間',
            4: '利 率',
            5: '波動度',
            6: '階 數'
        };
        $scope.mt = {
            1: '現貨價格',
            2: '履約價格',
            3: '存續區間',
            4: '利 率',
            5: '波動度',
            6: '模擬次數'
        };
        $scope.im = {
            1: '現貨價格',
            2: '履約價格',
            3: '存續區間',
            4: '利 率',
            5: '買權價格',
            6: '賣權價格'
        };
        $scope.trade1 = {
            1: '買入買權',
            2: '買入賣權',
            3: '賣出買權',
            4: '賣出賣權'
        };
        $scope.Black_Scholes = function() {
            var a = [$scope.bsmodel.S, $scope.bsmodel.X, $scope.bsmodel.T, $scope.bsmodel.r, $scope.bsmodel.v, $scope.select];
            // console.log(a);
            var data=monkserve.Black_Scholes(a);//產生data
            //表格顯示的scope
            var scope_array=["deltac", "deltap", "gammac", "vegac", "thetac", "thetap", "rhoc", "rhop", "callprice", "putprice", "gammap", "vegap"];
            for(var k=0; k<12; k++){
                if(k==2||k==10) $scope[scope_array[k]]=data[0][2][5];
                else if(k==3||k==11) $scope[scope_array[k]]=data[0][3][5];
                else $scope[scope_array[k]]=data[0][k][5];
            }
            //表格顯示的scope
            $('#Black_Scholes').highcharts({
                title: {
                    text: 'Black-Scholes Model',
                    x: -20
                },
                xAxis: {
                    title: {
                        text: data[1]
                    },
                    categories: data[0][10]
                },
                series: [{
                    name: 'call',
                    data: data[0][8],
                    visible: true
                }, {
                    name: 'put',
                    data: data[0][9],
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: '選擇權價格'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return data[1] + ': ' + this.key + '</b><br/>' + ' 選擇權價格: ' + this.y;
                    }
                }
            });
            if ($scope.wtf == 1) {
                var txtt = "Delta";
                var databsc = data[0][0];
                var databsp = data[0][1];
            } else if ($scope.wtf == 2) {
                var txtt = "Gamma";
                var databsc = data[0][2];
                var databsp = data[0][2];
            } else if ($scope.wtf == 3) {
                var txtt = "Vega";
                var databsc = data[0][3];
                var databsp = data[0][3];
            } else if ($scope.wtf == 4) {
                var txtt = "Theta";
                var databsc = data[0][4];
                var databsp = data[0][5];
            } else if ($scope.wtf == 5) {
                var txtt = "Rho";
                var databsc = data[0][6];
                var databsp = data[0][7];
            }
            $('#container').highcharts({
                title: {
                    text: txtt,
                    x: -20
                },
                xAxis: {
                    title: {
                        text: data[1]
                    },
                    categories: data[0][10]
                },
                series: [{
                    name: 'call',
                    data: databsc,
                    visible: true
                }, {
                    name: 'put',
                    data: databsp,
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: ' '
                    }
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return data[1] + ': ' + this.key + '</b><br/>' + ' 數值: ' + this.y;
                    }
                }
            });
        }
        $scope.Binomial_tree = function() {
            var aa = [$scope.tree.S, $scope.tree.X, $scope.tree.T, $scope.tree.r, $scope.tree.v, $scope.tree.n, $scope.select];
            var data=monkserve.Binomial_tree(aa);//產生data

            var scope_array=["deltac", "deltap", "gammac", "gammap", "vegac", "vegap", "thetac", "thetap", "rhoc", "rhop", "callprice", "putprice"];
            for(var k=0; k<12; k++){
                $scope[scope_array[k]]=data[0][k][5];
            }
            $('#binomial_tree').highcharts({
                title: {
                    text: 'Binomial Tree',
                    x: -20
                },
                xAxis: {
                    title: {
                        text: data[1]
                    },
                    categories: data[0][12]
                },
                series: [{
                    name: 'call',
                    data: data[0][10],
                    visible: true
                }, {
                    name: 'put',
                    data: data[0][11],
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: '選擇權價格'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return data[1] + ': ' + this.key + '</b><br/>' + ' 選擇權價格: ' + this.y;
                    }
                }
            });
            if ($scope.wtf == 1) {
                var txtt = "Delta";
                var datatc = data[0][0];
                var datatp = data[0][1];
            } else if ($scope.wtf == 2) {
                var txtt = "Gamma";
                var datatc = data[0][2];
                var datatp = data[0][3];
            } else if ($scope.wtf == 3) {
                var txtt = "Vega";
                var datatc = data[0][4];
                var datatp = data[0][5];
            } else if ($scope.wtf == 4) {
                var txtt = "Theta";
                var datatc = data[0][6];
                var datatp = data[0][7];
            } else if ($scope.wtf == 5) {
                var txtt = "Rho";
                var datatc = data[0][8];
                var datatp = data[0][9];
            }
            $('#container2').highcharts({
                title: {
                    text: txtt,
                    x: -20
                },
                xAxis: {
                    title: {
                        text: data[1]
                    },
                    categories: data[0][12]
                },
                series: [{
                    name: 'call',
                    data: datatc,
                    visible: true
                }, {
                    name: 'put',
                    data: datatp,
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: ' '
                    }
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return data[1] + ': ' + this.key + '</b><br/>' + ' 數值: ' + this.y;
                    }
                }
            }); //#binomial_tree chart//
        }
        $scope.monte_carlo = function() {
            var a = [ $scope.monte.S, $scope.monte.X, $scope.monte.T, $scope.monte.r, $scope.monte.v, $scope.monte.m, $scope.select];
            var data = monkserve.Monte_Carlo(a);

            var scope_array=["call", "put"];
            for(var k=0; k<2; k++){
                $scope[scope_array[k]]=data[0][k][5];
            }

            $('#monte_carlo').highcharts({
                title: {
                    text: 'Monte Carlo',
                    x: -20
                },
                xAxis: {
                    title: {
                        text: data[1]
                    },
                    categories: data[0][2]
                },
                series: [{
                    name: 'call',
                    data: data[0][0],
                    visible: true
                }, {
                    name: 'put',
                    data: data[0][1],
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: '選擇權價格'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return data[1] + ': ' + this.key + '</b><br/>' + ' 選擇權價格: ' + this.y;
                    }
                }
            });
        }
        $scope.implied_volatility = function() {
            var a = [$scope.S, $scope.X, $scope.T, $scope.r, $scope.Targetc, $scope.Targetp, $scope.select];
            var data=monkserve.implied_volatility(a);

            $scope.call = data[0][5];
            $scope.put = data[1][5];
            /******************************************************************************/
            if (data[5][0] == 0) {
                var array = data[2];
            } else {
                var array = data[3];
            };
            if (data[5][1] == 0) {
                data[0] = [];
            };
            if (data[5][2] == 0) {
                data[1] = [];
            };
            if (data[5][0] == 1 && data[5][2] == 0) {
                data[0] = [];
            };
            if (data[5][0] == 0 && data[5][1] == 0) {
                data[1] = [];
            }
            $('#impliedvol').highcharts({
                title: {
                    text: 'implied volatility',
                    x: -20
                },
                xAxis: {
                    title: {
                        text: data[4]
                    },
                    categories: array
                },
                series: [{
                    name: 'implied volatility for Call',
                    data: data[0],
                    visible: true
                }, {
                    name: 'implied volatility for Put',
                    data: data[1],
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: '%'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return data[4] + ': ' + this.key + '</b><br/>' + ' 隱波率: ' + this.y + '%';
                    }
                }
            });
        }
        $scope.trade = function(S_a, X_a, P_a, S_b, X_b, P_b, S_c, X_c, P_c, S_d, X_d, P_d) {
            if (!S_b) {
                var t2 = 0
            };
            if (!S_c) {
                var t3 = 0
            };
            if (!S_d) {
                var t4 = 0
            };
            var s_achg = S_a;
            var s_bchg = S_b;
            var s_cchg = S_c;
            var s_dchg = S_d;
            var s_delta = 0;
            var x_achg = X_a;
            var x_bchg = X_b;
            var x_cchg = X_c;
            var x_dchg = X_d;
            var x_delta = 0;
            var p_achg = P_a;
            var p_bchg = P_b;
            var p_cchg = P_c;
            var p_dchg = P_d;
            var p_delta = 0;
            var aa = [];
            var bb = [];
            var cc = [];
            var dd = [];
            var ee = [];
            var s_chga = s_achg / 10;
            var s_deltaa = s_chga;
            var x_chga = x_achg
            var p_chga = p_achg
            var i = 0;
            switch ($scope.select1) {
                case "1": //
                    var trade = 0;
                    break;
                case "2": //
                    var trade = 1;
                    break;
                case "3": //
                    var trade = 2;
                    break;
                case "4": //
                    var trade = 3;
                    break;
            }
            var cate_array = []; //用來製造x軸//
            if (trade == 0) {
                while (i < 22) {
                    var cashflow = Math.max(s_chga - x_chga - p_chga, -p_chga);
                    s_chga += s_deltaa;
                    aa.push(cashflow);
                    cate_array.push(s_chga);
                    i++;
                }
            } else if (trade == 1) {
                while (i < 22) {
                    var cashflow = Math.max(x_chga - s_chga - p_chga, -p_chga);
                    s_chga += s_deltaa;
                    aa.push(cashflow);
                    cate_array.push(s_chga);
                    i++;
                }
            } else if (trade == 2) {
                while (i < 22) {
                    var cashflow = Math.min(x_chga - s_chga + p_chga, p_chga);
                    s_chga += s_deltaa;
                    aa.push(cashflow);
                    cate_array.push(s_chga);
                    i++;
                }
            } else if (trade == 3) {
                while (i < 22) {
                    var cashflow = Math.min(s_chga - x_chga + p_chga, p_chga);
                    s_chga += s_deltaa;
                    aa.push(cashflow);
                    cate_array.push(s_chga);
                    i++;
                }
            }
            switch ($scope.select2) {
                case "1": //
                    var trade = 0;
                    break;
                case "2": //
                    var trade = 1;
                    break;
                case "3": //
                    var trade = 2;
                    break;
                case "4": //
                    var trade = 3;
                    break;
            }
            if (trade == 0) {
                var s_chgb = s_bchg / 10;
                var s_deltab = s_chgb;
                var x_chgb = x_bchg
                var p_chgb = p_bchg
                var i = 0;
                while (i < 22) {
                    var cashflow1 = Math.max(s_chgb - x_chgb - p_chgb, -p_chgb);
                    s_chgb += s_deltab;
                    bb.push(cashflow1);
                    i++;
                }
            } else if (trade == 1) {
                var s_chgb = s_bchg / 10;
                var s_deltab = s_chgb;
                var x_chgb = x_bchg
                var p_chgb = p_bchg
                var i = 0;
                while (i < 22) {
                    var cashflow1 = Math.max(x_chgb - s_chgb - p_chgb, -p_chgb);
                    s_chgb += s_deltab;
                    bb.push(cashflow1);
                    i++;
                }
            } else if (trade == 2) {
                var s_chgb = s_bchg / 10;
                var s_deltab = s_chgb;
                var x_chgb = x_bchg
                var p_chgb = p_bchg
                var i = 0;
                while (i < 22) {
                    var cashflow1 = Math.min(x_chgb - s_chgb + p_chgb, p_chgb);
                    s_chgb += s_deltab;
                    bb.push(cashflow1);
                    i++;
                }
            } else if (trade == 3) {
                var s_chgb = s_bchg / 10;
                var s_deltab = s_chgb;
                var x_chgb = x_bchg
                var p_chgb = p_bchg
                var i = 0;
                while (i < 22) {
                    var cashflow1 = Math.min(s_chgb - x_chgb + p_chgb, p_chgb);
                    s_chgb += s_deltab;
                    bb.push(cashflow1);
                    i++;
                }
            }
            switch ($scope.select3) {
                case "1": //
                    var trade = 0;
                    break;
                case "2": //
                    var trade = 1;
                    break;
                case "3": //
                    var trade = 2;
                    break;
                case "4": //
                    var trade = 3;
                    break;
            }
            if (trade == 0) {
                var s_chgc = s_cchg / 10;
                var s_deltac = s_chgc;
                var x_chgc = x_cchg
                var p_chgc = p_cchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.max(s_chgc - x_chgc - p_chgc, -p_chgc);
                    s_chgc += s_deltac;
                    cc.push(cashflow);
                    i++;
                }
            } else if (trade == 1) {
                var s_chgc = s_cchg / 10;
                var s_deltac = s_chgc;
                var x_chgc = x_cchg
                var p_chgc = p_cchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.max(x_chgc - s_chgc - p_chgc, -p_chgc);
                    s_chgc += s_deltac;
                    cc.push(cashflow);
                    i++;
                }
            } else if (trade == 2) {
                var s_chgc = s_cchg / 10;
                var s_deltac = s_chgc;
                var x_chgc = x_cchg
                var p_chgc = p_cchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.min(x_chgc - s_chgc + p_chgc, p_chgc);
                    s_chgc += s_deltac;
                    cc.push(cashflow);
                    i++;
                }
            } else if (trade == 3) {
                var s_chgc = s_cchg / 10;
                var s_deltac = s_chgc;
                var x_chgc = x_cchg
                var p_chgc = p_cchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.min(s_chgc - x_chgc + p_chgc, p_chgc);
                    s_chgc += s_deltac;
                    cc.push(cashflow);
                    i++;
                }
            }
            switch ($scope.select4) {
                case "1": //
                    var trade = 0;
                    break;
                case "2": //
                    var trade = 1;
                    break;
                case "3": //
                    var trade = 2;
                    break;
                case "4": //
                    var trade = 3;
                    break;
            }
            if (trade == 0) {
                var s_chgd = s_dchg / 10;
                var s_deltad = s_chgd;
                var x_chgd = x_dchg
                var p_chgd = p_dchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.max(s_chgd - x_chgd - p_chgd, -p_chgd);
                    s_chgd += s_deltad;
                    dd.push(cashflow);
                    i++;
                }
            } else if (trade == 1) {
                var s_chgd = s_dchg / 10;
                var s_deltad = s_chgd;
                var x_chgd = x_dchg
                var p_chgd = p_dchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.max(x_chgd - s_chgd - p_chgd, -p_chgd);
                    s_chgd += s_deltad;
                    dd.push(cashflow);
                    i++;
                }
            } else if (trade == 2) {
                var s_chgd = s_dchg / 10;
                var s_deltad = s_chgd;
                var x_chgd = x_dchg
                var p_chgd = p_dchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.min(x_chgd - s_chgd + p_chgd, p_chgd);
                    s_chgd += s_deltad;
                    dd.push(cashflow);
                    i++;
                }
            } else if (trade == 3) {
                var s_chgd = s_dchg / 10;
                var s_deltad = s_chgd;
                var x_chgd = x_dchg
                var p_chgd = p_dchg
                var i = 0;
                while (i < 22) {
                    var cashflow = Math.min(s_chgd - x_chgd + p_chgd, p_chgd);
                    s_chgd += s_deltad;
                    dd.push(cashflow);
                    i++;
                }
            }
            if (t2 == 0) {
                var bb = [];
                var ee = aa
            };
            if (t3 == 0) {
                var cc = [];
            };
            if (t4 == 0) {
                var dd = [];
            }
            var j = 0;
            if (t2 != 0 && t3 == 0 && t4 == 0) {
                while (j < 22) {
                    var cashflow = aa[j] + bb[j];
                    ee.push(cashflow);
                    j++;
                }
            }
            if (t2 != 0 && t3 != 0 && t4 == 0) {
                while (j < 22) {
                    var cashflow = aa[j] + bb[j] + cc[j];
                    ee.push(cashflow);
                    j++;
                }
            }
            if (t2 != 0 && t3 != 0 && t4 != 0) {
                while (j < 22) {
                    var cashflow = aa[j] + bb[j] + cc[j] + dd[j];
                    ee.push(cashflow);
                    j++;
                }
            }
            var max = Math.max(...ee);
            var min = Math.min(...ee);
            $scope.max = max;
            $scope.min = min;
            $('#trade').highcharts({
                title: {
                    text: '買賣權策略損益圖',
                    x: -20
                },
                chart: {
                    type: 'line',
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift'
                },
                xAxis: {
                    title: {
                        text: "現貨價格"
                    },
                    categories: cate_array
                },
                series: [{
                    name: '選擇權一',
                    data: aa,
                    visible: true
                }, {
                    name: '選擇權二',
                    data: bb,
                    visible: true
                }, {
                    name: '選擇權三',
                    data: cc,
                    visible: true
                }, {
                    name: '選擇權四',
                    data: dd,
                    visible: true
                }, {
                    name: '損益線',
                    data: ee,
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: 'Price '
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'red'
                    }]
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return '現貨價格 : ' + this.key + '</b><br/>' + ' 買賣損益: ' + this.y;
                    }
                }
            });
        }
        $(document).ready(function() {
            //$("#name").focus(); input框输入内容然后刷新页面，input框内容还在(firefox)
            clearText(); // 改用clearText
            $("#addBtn").click(function() {
                $("#table1").append(getNewRow());
                clearText();
            });
            $("#table1").on('click', ".delBtn", function() {
                $(this).parent().parent().remove();
            });
        });

        function clearText() {
            $("#N").val("");
            $("#S").val("");
            $("#X").val("");
            $("#P").val("");
            $("#N").focus();
        }

        function getNewRow() {
            var btn = $("<input class='delBtn' type='button' value='删除' />");
            var newRow = $("<tr>").append($("<td>").append($("#N").val())).append($("<td>").append($("#S").val())).append($("<td>").append($("#X").val())).append($("<td>").append($("#P").val())).append($("<td>").append(btn));
            return newRow;
        }
        var target = [];
        var target2 = [];
        $scope.trade2 = function() {
            var a = [$scope.trade.N, $scope.trade.S, $scope.trade.X, $scope.trade.P];
            target.push(a);
            var cate_array = []; //用來製造x軸//
            for (var i = 0; i < target.length; i++) {
                var s_chgd = target[i][1] / 10;
                var s_deltad = s_chgd;
                var cashflow;
                var dd = [];
                var n = 0;
                while (n < 22) {
                    switch (target[i][0]) {
                        case 0:
                            cashflow = Math.max(s_chgd - target[i][2] - target[i][3], -target[i][3]);
                            break;
                        case 1:
                            cashflow = Math.max(target[i][2] - s_chgd - target[i][3], -target[i][3]);
                            break;
                        case 2:
                            cashflow = Math.min(target[i][2] - s_chgd + target[i][3], target[i][3]);
                            break;
                        case 3:
                            cashflow = Math.min(s_chgd - target[i][2] + target[i][3], target[i][3]);
                            break;
                    }
                    s_chgd += s_deltad;
                    dd.push(cashflow);
                    n++;
                };
            }
            target2.push(dd);
            // console.log(target2);
            var ee = [];
            var z = 0;
            var wtf_max = [-100000, 0];
            var wtf_min = [1000000000000, 0];
            while (z < 22) {
                var e = 0;
                for (var r = 0; r < target2.length; r++) {
                    e += target2[r][z];
                    if (target2[r][z] > wtf_max[0]) {
                        wtf_max[0] = target2[r][z];
                        wtf_max[1] = r + 1;
                    } else if (target2[r][z] < wtf_min[0]) {
                        wtf_min[0] = target2[r][z];
                        wtf_min[1] = r + 1;
                    }
                }
                ee.push(e)
                z++;
            }
            // console.log(wtf_max);
            // console.log(wtf_min);
            $scope.gibberish = '目前最佳策略是, 策略' + wtf_max[1] + ', 獲利為' + wtf_max[0] + '; 最糟策略是, 策略' + wtf_min[1] + ', 虧損為' + wtf_min[0];
            //target2.splice(delelte, 1)
            var max = Math.max(...ee)
            var min = Math.min(...ee)
            $scope.max = max;
            $scope.min = min;
            $('#tradepic').highcharts({
                title: {
                    text: '買賣權策略損益圖',
                    x: -20
                },
                chart: {
                    type: 'line',
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift'
                },
                xAxis: {
                    title: {
                        text: '現貨價格'
                    },
                    categories: cate_array
                },
                series: [{
                    name: '損益線',
                    data: ee,
                    visible: true
                }],
                yAxis: {
                    title: {
                        text: ' Price '
                    },
                    plotLines: [{
                        value: 0,
                        width: 2,
                        color: 'red'
                    }]
                },
                credits: {
                    text: 'Index'
                },
                tooltip: {
                    formatter: function() {
                        return ' 現貨價格: ' + this.key + '</b><br/>' + ' 買賣損益: ' + Highcharts.numberFormat(this.y, 2);
                    }
                }
            });
        }

        // *********************************************************************
        $scope.opttactic = {
          "merch":["台指選","金指選","電指選"],
          "direction":monkserve.option_strategy,
          "tactic":[
            {"name":"straddle"},
            {"name":"strangle"},
            {"name":"reversals"},
            {"name":"conversions"},
            {"name":"coveredcall"},
            {"name":"reversecoveredcall"},
            {"name":"protectiveput"},
            {"name":"reverseprotectiveput"},
            {"name":"ratio"},
            {"name":"ratioback"},
            {"name":"bullspread"},
            {"name":"bearspread"},
            {"name":"butterfly"},
            {"name":"condor"},
          ],
          "modelPara":{
          },
          "buysell" : ["買進","賣出"],
          "callput" : ["買權","賣權"],
          "ngno" : [0,1,2,3,4],
          "unit":100,
          "unitQ":20,
          "highChart":"",
          "postArr":[],
          "textArr":[],
          "getModel":{},
          //-----------------------------------------------
          "getData":{},
          "test":[],
        };

        // console.log($scope.opttactic)
        $scope.slider = {
          Vvalue: 20,
          Hvalue: 50,
          voptions: {floor: 1,ceil: 100,step: 1,vertical: true},
          hoptions: {floor: 1,ceil: 200,step: 1}
        };
        // console.log(monkserve.optProfit(102,100,34,-1,1));
        $scope.actionOption = function (value,name) {
          // console.log(value,name);
          $scope.tab_number = value;
          $scope.tab_name = name;
        };
        $scope.testfun = {};
        // console.log($scope.opttactic.modelPara);
        $scope.testfun.merch = function (name,val) {
          if (val=="prod"){
            if ($scope.opttactic.modelPara.prod =="台指選"){
              $scope.opttactic.modelPara.prod = {"name":"台指選","fut":"tx","opt":"txo"};
            }else if($scope.opttactic.modelPara.prod =="金指選"){
              $scope.opttactic.modelPara.prod = {"name":"金指選","fut":"tf","opt":"tfo"};
            }else if($scope.opttactic.modelPara.prod =="電指選"){
              $scope.opttactic.modelPara.prod = {"name":"電指選","fut":"te","opt":"teo"};
            }
          }
          // console.log($scope.opttactic.modelPara);
          $scope.opttactic.modelPara.indicator = val;
          var qq = $http({
              method: 'POST',
              url: app_service.url_path + '/tactic/tactic/optseleced',
              contentType: "application/json",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: $scope.opttactic.modelPara,
          });
          $q.all([qq]).then(function(apidata) {
            // console.log(apidata[0]);
            switch (val){
              case "prod":
              $scope.opttactic.dateList = apidata[0].data;
              break;
              case "date":
                // $scope.opttactic.expList = apidata[0].data;
                apidata[0].columns = apidata[0].data[0];
                var tableHeaders="",foot=[];
                $.each(apidata[0].columns, function(i, val){
                    // console.log(i,val)
                    tableHeaders += '<th class="col-md-1">' + val + '</th>';
                    foot.push(val);
                    $scope.opttactic.foot = foot;
                  });

                $("#hello").empty();
                $("#hello").append('<table id="dontknowhow" class="table table-striped table-bordered" cellspacing="0" width="100%"><thead><tr><th colspan="5" class="td_size official-th-po-m">買權 Call</th>'+
                '<th colspan="1"></th><th colspan="5" class="td_size official-th-po-m">賣權 Put</th></tr><tr>'
                +tableHeaders + '</tr></thead><tfoot><tr>'+ tableHeaders +'</tr></tfoot></table>');
                var table = $('#dontknowhow').DataTable({
                    //"dom": '<"toolbar">frtip',
                    // "processing": true,
                    "columnDefs": [{
                        "visible": false,
                    }],
                    "columns": [
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                        { "className": "text-center" },
                    ],
                    "order": [
                        [5, "asc"]
                    ],
                    "createdRow": function(row, data, index) {
                        // console.log(row);
                        for (var i = 0; i < data.length+1; i++) {
                            if (i < 5)
                                data[i] == "無資料" ? $('td', row).eq(i).empty() : $('td', row).eq(i).empty().html('<a href="#" class="btn btn-danger btn-lg" ></a>');
                            else if( i == 5)
                                $('td', row).eq(5).css('background-color', '#fce4cf');
                            else
                                data[i] == "無資料" ? $('td', row).eq(i).empty() : $('td', row).eq(i).empty().html('<a href="#" class="btn btn-success btn-lg" ></a>');
                        }
                    },
                    "language": {
                        "loadingRecords": "讀取中, 請稍候...",
                        "lengthMenu": "一頁 _MENU_ 筆資料",
                        "zeroRecords": "無此分類指數",
                        "info": "第 _PAGE_ 頁 ( 總共 _PAGES_ 頁 )",
                        "processing": "資料搜尋中, 請稍候!",
                        "thousands": ".",
                        "decimal":",",
                        "paginate": {
                            "previous": "<<",
                            "next": ">>",
                        },
                        "search": "搜尋"
                    },
                    "sPaginationType": "full_numbers",
                    aLengthMenu: [
                        [5, 10, 25, 50, 100, -1],
                        [5, 10, 25, 50, 100, "All"]
                    ],
                    iDisplayLength: 10,
                    "displayStart": 30,//Show row 30 as the first row in the table on startup:
                    data: apidata[0].data[1],
                    destroy: true,
                });

                $scope.howhow = [];
                $("#hello tbody").on("click","td",function(){
                    var index = table.cell( this ).index().columnVisible;
                    var value = table.cell(this).data();
                    var cp = "",expmon="";
                    $scope.$apply(function() {
                        //決定button為買權還是賣權
                        for (var key in foot){
                            if (key==index){
                                expmon=foot[key]
                                index < 6 ? cp="買權" : cp="賣權"
                            }
                        }
                        $scope.howhow.push({
                            strike : value,
                            expmon : expmon,
                            cp : cp
                        })
                    })
                });
              break;
            }
          });
        }
        $scope.optmodelfunc = {};
        $scope.optmodelfunc.selectfunc = function (val) {
          // console.log(val);
          if (val=="prod"){
            if ($scope.opttactic.modelPara.prod =="台指選"){
              $scope.opttactic.modelPara.prod = {"name":"台指選","fut":"tx","opt":"txo"};
            }else if($scope.opttactic.modelPara.prod =="金指選"){
              $scope.opttactic.modelPara.prod = {"name":"金指選","fut":"tf","opt":"tfo"};
            }else if($scope.opttactic.modelPara.prod =="電指選"){
              $scope.opttactic.modelPara.prod = {"name":"電指選","fut":"te","opt":"teo"};
            }
          }
          $scope.opttactic.modelPara.indicator = val;
          var qq = $http({
              method: 'POST',
              url: app_service.url_path + '/tactic/tactic/optselectapi',
              contentType: "application/json",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: $scope.opttactic.modelPara,
          });
          // console.log($scope.opttactic.modelPara);

          $q.all([qq]).then(function(apidata) {
            // console.log(apidata[0]);dateList  strList  expList
            switch (val){
              case "prod":
              $scope.opttactic.expList = apidata[0].data;
              break;
              case "expmon":
              $scope.opttactic.dateList = apidata[0].data;
              break;
              case "date":
                $scope.opttactic.strList = apidata[0].data;
              break;
              case "str":
              $scope.opttactic.wtf = apidata[0].data;
              break;
            }
          });
        }
        $scope.optmodelfunc.addfunc = function () {
          var tmp = _.cloneDeep($scope.opttactic.modelPara);
          $scope.opttactic.tmpPostArr.push(tmp);
          switch ($scope.opttactic.modelPara.tactic.name){
            case "strangle":
            delete $scope.opttactic.modelPara.strike;
            break;
            case "straddle":
            delete $scope.opttactic.modelPara.date;
            delete $scope.opttactic.modelPara.expmon;
            break;
          }

        }
        $scope.optmodelfunc.delfunc = function (pos) {
          $scope.opttactic.tmpPostArr.splice(pos, 1);
        }
        $scope.optmodelfunc.tacticcp = function (tactic, indicator,type) {
          // console.log(tactic, indicator,type);
          if (tactic=="bullspread"||tactic=="bearspread"){
            $scope.opttactic.modelPara.cp=indicator=="買權"?["買權","買權"]:["賣權","賣權"];
            $scope.opttactic.modelPara.bs=["買進","賣出"];
          }else if(tactic=="ratio"||tactic=="ratioback"){
            $scope.opttactic.modelPara.cp=indicator=="買權"?["買權","買權","買權"]:["賣權","賣權","賣權"];
            $scope.opttactic.modelPara.bs=tactic=="ratio"?["買進","賣出","賣出"]:["買進","買進","賣出"];
          }else{
            $scope.opttactic.modelPara.cp=indicator=="買權"?["買權","買權","買權","買權"]:["賣權","賣權","賣權","賣權"];
            $scope.opttactic.modelPara.bs=type=="盤整"?["買進","賣出","賣出","買進"]:["賣出","買進","買進","賣出"];
            // $scope.opttactic.modelPara.bs[0]=type=="突破"?["買進","賣出","賣出","買進"]:["賣出","買進","買進","賣出"];
          }
        }
        $scope.optmodelfunc.pushsame = function (ngno,agent,modelagent) {
          $scope.opttactic.modelPara[agent]=[];
          for (var i=0;i<ngno;i++){
            $scope.opttactic.modelPara[agent][i] = modelagent;
          }
        }
        $scope.optmodelfunc.erase = function (val) {
          // console.log(val);
          // $scope.opttactic.modelPara = {};//先暫時關掉
          $scope.opttactic.modelPara.tactic = val;//
          // console.log($scope.opttactic.modelPara.tactic);
       }
        $scope.AddStra = function () {
            // console.log($scope.opttactic.modelPara)
          var tmp = _.cloneDeep($scope.opttactic.modelPara);
          // console.log(tmp);
          $scope.opttactic.postArr.push(tmp);
          $scope.opttactic.modelPara={};
          if (["straddle","strangle","reversals","conversions"].includes(tmp.tactic.name)) {
            $scope.opttactic.textArr.push([
              "策略 : "+tmp.tactic.name+". 日期 : "+tmp.date+". 到期月份 : "+tmp.expmon[0],
              tmp.prod.name+" "+tmp.bs[0]+"履約價格"+tmp.strike[0]+"買權. "+tmp.bs[0]+"履約價格"+tmp.strike[0]+"賣權."
            ]);
          }
        }
        $scope.DelStra = function (index) {
          $scope.opttactic.postArr.splice(index, 1);
          $scope.detail = [];//實質損益清空
        }
        $scope.confirm = function () {
            var tmp = _.cloneDeep($scope.opttactic.modelPara);
            var tmp2 = _.cloneDeep($scope.opttactic.getData);
            $scope.opttactic.test.push({
                date : tmp.date,
                // indicator : tmp.indicator,
                prod : tmp.prod,
                // tactic : tmp.tactic,
                bs : tmp2.bs,
                cp : tmp2.cp,
                expmon : tmp2.expmon,
                strike : tmp2.strike
            })
        }
        $scope.bbpp = function () {
          var qq = $http({
              method: 'POST',
              url: app_service.url_path + '/tactic/tactic/optgetraw',
              contentType: "application/json",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: $scope.opttactic.postArr,
          });
          // console.log($scope.opttactic.postArr);
          var pbar={
            name:"損益",
            data:[]
          };
          $q.all([qq]).then(function(apidata) {
            // console.log(apidata);
            //檢查是否有回傳資料


            $scope.opttactic.result = apidata[0].data;
            var greeks;
            [pbar.data, greeks] = monkserve.testUnit($scope.opttactic);
            // console.log(greeks);
            $scope.greeks=[];
            var greeks_name=['選擇權','履約價','Delta', 'Gamma', 'Theta', 'Rho', 'Vega',' Implied Volatility'];
            for (var i = 0; i < greeks.length; i++) {
              $scope.greeks[i] = [];
                for (var j = 0; j < greeks[i].length; j++) {
                    if( typeof greeks[i][j] == "number" ){
                        //Implied Volatility
                        if(j == 7){
                            $scope.greeks[i].push({
                                'name': greeks_name[j],
                                'value' : Math.round(greeks[i][j]*100)+"%"
                            })
                        }else if(j == 1){
                            $scope.greeks[i].push({
                                'name': greeks_name[j],
                                'value' : greeks[i][j]
                            })
                        }else {
                            $scope.greeks[i].push({
                                'name': greeks_name[j],
                                'value' : greeks[i][j].toPrecision(2)
                            })
                        }
                    }else{
                        $scope.greeks[i].push({
                            'name': greeks_name[j],
                            'value' :greeks[i][j]
                        })
                    }
                }
            }
            // console.log(pbar);
            $scope.opttactic.highChart = new Highcharts.Chart({
                title: {
                    text: '策略分析'
                },
                chart:{
                  height:400,
                  renderTo:"testcontainer",
                  borderRadius: 10,
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                xAxis: {
                  labels : {
                    'format': "{value}"
                  },
                },
                yAxis: {
                  title: {
                    text: '損益'
                  },
                  labels : {
                    align: 'right',
                    'format': "{value}點"
                  },
                   plotLines: [{
                    color: 'white',
                    width: 4,
                    value: 0,
                    label: {
                        text: 'break even',
                        verticalAlign: 'middle',
                        align: 'right',
                        x: -10,
                        y: 16,
                        style: {
                            color: 'yellow',
                            fontWeight: 'bold'
                        }
                    }
                   }]
                },
                tooltip: {
                    crosshairs: true,
                    // shared: true,
                    borderColor: '#53aa27',
                    borderWidth: 3,
                    borderRadius: 8,
                    headerFormat: '履約價: <b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: <b>{point.y}點</b>',
                    style:{
                        "fontSize": "18px",
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            borderRadius: 5,
                            backgroundColor: 'rgba(252, 255, 197, 0.7)',
                            borderWidth: 1,
                            borderColor: '#AAA',
                            y: -16,
                            formatter: function () {
                                // console.log(this.point);
                                if (this.point.options.showLabel) {
                                    if (this.point.options.showLost){
                                        return "最大虧損: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                                    }
                                    return "最大獲利: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                                }
                                return null;
                            }
                        }
                    }
                },
                series: [pbar],
            },callback);
            // console.log($scope.opttactic.highChart)
          });
        }

        $scope.realProfit = function () {
            $http.get(tactic_path + 'user').success(function(role) {//判斷會員等級 30 ＝vip, 10 = 一般
                if (role['id'] === 30) {
                     var qq = $http({
                          method: 'POST',
                          url: app_service.url_path + '/tactic/tactic/opttesting',
                          contentType: "application/json",
                          headers: {
                              'Content-Type': 'application/x-www-form-urlencoded'
                          },
                          data: $scope.opttactic.postArr,
                      });
            // console.log($scope.opttactic.postArr);
                    $q.all([qq]).then(function(apidata) {
                        // console.log(apidata);

                        $scope.detail = [];
                        $scope.detailtitle = "選擇權實質報酬明細";
                        var detail_name = ["期貨漲跌(點)","期貨漲跌幅(%)","權利金成本(點)","出場損益(點)"];
                        for (var i = 4; i < apidata[0].data.length-3; i++) {
                            if (apidata[0].data[i] > 0) {
                              var cstyle = 'table-td-elem-up';
                              // var istyle = '↑(多)';
                            } else if (apidata[0].data[i] == 0) {
                              var cstyle = 'table-td-elem-nm';
                              // var istyle = '';
                            } else {
                              var cstyle = 'table-td-elem-dn';
                              // var istyle = '↓(空)';
                            }
                            $scope.detail.push([{
                                'name': detail_name[i-4],
                                'class': 'table-td-title'
                              },
                              {
                                'name': apidata[0].data[i] ,
                                'class': cstyle
                              }
                            ]);
                        };

                        //realchart_futures
                        Highcharts.setOptions({
                          lang: {
                            thousandsSep: ',',
                          }
                        });
                        var alldata = {
                          ChartElements: {
                            legend: H_legend.general_legend,
                            rangeSelector: H_rangeSelector.rangeSelector_made_1(2),
                            plotOptions: H_plotOptions.kd,
                          }
                        };
                        alldata.ChartElements.chart = H_chart.all_chart("realProfit_futures");
                        alldata.ChartElements.series = monkserve.realchart_futures(apidata[0].data[3]);
                        alldata.ChartElements.yAxis = monkserve.realchart_yAxis("");
                        alldata.ChartElements.title = H_title.general_basic("台指期貨走勢圖");
                        alldata.ChartElements.tooltip = monkserve.realchart_tooltip("realProfit_futures",apidata[0].data[3]);
                        alldata.Chart = new Highcharts.StockChart(alldata.ChartElements);
                        //realProfit
                        Highcharts.setOptions({
                          lang: {
                            thousandsSep: ',',
                          }
                        });
                        var alldata = {
                          ChartElements: {
                            legend: H_legend.general_legend,
                            rangeSelector: H_rangeSelector.rangeSelector_made_1(2),
                            plotOptions: H_plotOptions.kd,
                          }
                        };
                        alldata.ChartElements.chart = H_chart.all_chart("realProfit");
                        alldata.ChartElements.series = monkserve.realchart(apidata[0].data[0],$scope.opttactic.postArr,"損益",apidata[0].data[2]);
                        alldata.ChartElements.yAxis = monkserve.realchart_yAxis("損益");
                        alldata.ChartElements.title = H_title.general_basic($scope.opttactic.postArr[0].tactic
                        .chinese+" 損益變化圖");
                        alldata.ChartElements.tooltip = monkserve.realchart_tooltip("realProfit",apidata[0].data[0]);
                        alldata.Chart = new Highcharts.StockChart(alldata.ChartElements);
                        //realStrike
                        Highcharts.setOptions({
                          lang: {
                            thousandsSep: ',',
                          }
                        });
                        var alldata = {
                          ChartElements: {
                            legend: H_legend.general_legend,
                            rangeSelector: H_rangeSelector.rangeSelector_made_1(2),
                            plotOptions: H_plotOptions.kd,
                          }
                        };
                        alldata.ChartElements.chart = H_chart.all_chart("realStrike");
                        alldata.ChartElements.series = monkserve.realstrike_chart(apidata[0].data[1],$scope.opttactic.postArr,"價格",apidata[0].data);
                        alldata.ChartElements.yAxis = monkserve.realchart_yAxis("履約價");
                        alldata.ChartElements.title = H_title.general_basic($scope.opttactic.postArr[0].tactic
                        .chinese+" 收盤價變化圖");
                        alldata.ChartElements.tooltip = monkserve.realchart_tooltip("realStrike",apidata[0].data[1]);
                        alldata.Chart = new Highcharts.StockChart(alldata.ChartElements);
                    });
                }else{
                    swal({
                      title: '你還不是VIP會員喔',
                      text: '想試試這項功能嗎～歡迎加入VIP會員<br>欲加入VIP會員可寄信至<span style="color:blue">service@aindex.com.tw</span>與我們聯繫</br>',
                      type: 'warning',
                      html: true
                    })
                }
            });
        }
        $scope.bpProfit = function () {
          var qq = $http({
              method: 'POST',
              url: app_service.url_path + '/tactic/tactic/optgetraw',
              contentType: "application/json",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: $scope.opttactic.test,
          });
          var pbar={
            name:"損益",
            data:[]
          };
          $q.all([qq]).then(function(apidata) {
            $scope.opttactic.result = apidata[0].data;
            var greeks;
            [pbar.data, greeks] = monkserve.testUnit($scope.opttactic);
            // console.log(greeks);
            $scope.greeks=[];
            var greeks_name=['選擇權','履約價','Delta', 'Gamma', 'Theta', 'Rho', 'Vega',' Implied Volatility'];
            for (var i = 0; i < greeks.length; i++) {
              $scope.greeks[i] = [];
                for (var j = 0; j < greeks[i].length; j++) {
                    if( typeof greeks[i][j] == "number" ){
                        //Implied Volatility
                        if(j == 7){
                            $scope.greeks[i].push({
                                'name': greeks_name[j],
                                'value' : Math.round(greeks[i][j]*100)+"%"
                            })
                        }else{
                            $scope.greeks[i].push({
                                'name': greeks_name[j],
                                'value' : Math.round(greeks[i][j]*100)/100
                            })
                        }
                    }else{
                        $scope.greeks[i].push({
                            'name': greeks_name[j],
                            'value' :greeks[i][j]
                        })
                    }
                }
            }
            // console.log($scope.greeks);
            $scope.opttactic.highChart = new Highcharts.Chart({
                title: {
                    text: '策略分析'
                },
                chart:{
                  height:400,
                  renderTo:"optionProfit",
                  borderRadius: 10,
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                xAxis: {
                  labels : {
                    'format': "{value}"
                  },
                },
                yAxis: {
                  title: {
                    text: '損益'
                  },
                  labels : {
                    align: 'right',
                    'format': "{value}點"
                  },
                   plotLines: [{
                    color: 'white',
                    width: 4,
                    value: 0,
                    label: {
                        text: 'break even',
                        verticalAlign: 'middle',
                        align: 'right',
                        x: -10,
                        y: 16,
                        style: {
                            color: 'yellow',
                            fontWeight: 'bold'
                        }
                    }
                   }]
                },
                tooltip: {
                    crosshairs: true,
                    // shared: true,
                    borderColor: '#53aa27',
                    borderWidth: 3,
                    borderRadius: 8,
                    headerFormat: '履約價: <b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: <b>{point.y}點</b>',
                    style:{
                        "fontSize": "18px",
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            borderRadius: 5,
                            backgroundColor: 'rgba(252, 255, 197, 0.7)',
                            borderWidth: 1,
                            borderColor: '#AAA',
                            y: -16,
                            formatter: function () {
                                // console.log(this.point);
                                if (this.point.options.showLabel) {
                                    if (this.point.options.showLost){
                                        return "最大虧損: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                                    }
                                    return "最大獲利: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                                }
                                return null;
                            }
                        }
                    }
                },
                series: [pbar],
            },callback);
            // console.log($scope.opttactic.highChart)
          });
        }
        $scope.DelOption = function (index) {
          $scope.opttactic.test.splice(index, 1);
        }
        //給highcharts圖內標示label
        function callback(chart) {
            // console.log(chart);
            var series = chart.series,
                points = series[0].points,
                minIndex = series[0].processedYData.indexOf(series[0].dataMin),
                maxIndex = series[0].processedYData.indexOf(series[0].dataMax);

            points[minIndex].options.showLabel = true;
            points[minIndex].options.showLost = true;
            points[maxIndex].options.showLabel = true;
            // points[lastIndex].options.showLabel = true;
            series[0].isDirty = true; // 若不存在則無法show label
            chart.redraw();
        }
        $scope.$watch('slider.Hvalue', function () {
          if (typeof $scope.opttactic.highChart !== 'undefined'){
            $scope.opttactic.unit = $scope.slider.Hvalue;
            var pbar,greeks;
            // console.log($scope.opttactic.highChart)
            [pbar, greeks] = monkserve.testUnit($scope.opttactic);
            $scope.opttactic.highChart.series[0].update({
              data:pbar,
            });
            $scope.opttactic.highChart.options.plotOptions.series.dataLabels.update({
              formatter: function () {
                    // console.log(this.point);
                    if (this.point.options.showLabel) {
                        if (this.point.options.showLost){
                            return "最大虧損: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                        }
                        return "最大獲利: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                    }
                    return null;
                }
            });
          }
        });

        $scope.$watch('slider.Vvalue', function () {
          if (typeof $scope.opttactic.highChart !== 'undefined'){
            $scope.opttactic.unitQ = $scope.slider.Vvalue;
            var pbar,greeks;
            // console.log($scope.opttactic.highChart)
            [pbar, greeks] = monkserve.testUnit($scope.opttactic);
            $scope.opttactic.highChart.series[0].update({
              data:pbar
            });
            $scope.opttactic.highChart.options.plotOptions.series.dataLabels.update({
              formatter: function () {
                    // console.log(this.point);
                    if (this.point.options.showLabel) {
                        if (this.point.options.showLost){
                            return "最大虧損: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                        }
                        return "最大獲利: "+'<span style="color:#f1f1f1;">'+this.y+'</span>';
                    }
                    return null;
                }
            });
          }
        });
        //*******************************************************
        $scope.opttactic.biteme = function (name,type) {
          // console.log(name,type);
          if (name=="straddle"||name=="strangle"){
            $scope.opttactic.modelPara.cp=["買權","賣權"];
            $scope.opttactic.modelPara.bs=type=="突破"?["買進","買進"]:["賣出","賣出"];
          }else if (name=="reversals"||name=="conversions"){
            $scope.opttactic.modelPara.cp=["買權","賣權"];
            $scope.opttactic.modelPara.bs=name=="reversals"?["買進","賣出"]:["賣出","買進"];
          }else if (name=="coveredcall"||name=="reversecoveredcall"){
            $scope.opttactic.modelPara.cp=["買權"];
            $scope.opttactic.modelPara.bs=name=="coveredcall"?["賣出"]:["買進"];
          }else if (name=="protectiveput"||name=="reverseprotectiveput"){
            $scope.opttactic.modelPara.cp=["賣權"];
            $scope.opttactic.modelPara.bs=name=="protectiveput"?["買進"]:["賣出"];
          }
        }
        $scope.clickDom = function (data) {
            // console.log(data);
        }
        $scope.remove_one = function(index){
          $scope.howhow.splice(index, 1);
        };//刪除進/出場指標
        $scope.remove_all = function(key,keyphp,graph,pidx){
          $scope.howhow=[];
        }//全部進/出場清除
        $(document).ready(function() {

          //Default Action
          $(".tab_content").hide(); //Hide all content
          // $("ul.tabs li:eq(4)").addClass("active").show(); //Activate first tab
          $(".tab_content:eq(4)").show(); //Show first tab content

          //On Click Event
          $("ul.tabs li").click(function() {
            $("ul.tabs li").removeClass("active"); //Remove any "active" class
            $(this).addClass("active"); //Add "active" class to selected tab
            $(".tab_content").hide(); //Hide all tab content
            var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
            $(activeTab).fadeIn(); //Fade in the active content
            return false;

          });
        }); //--製作頁籤tab
    }
]);

monk.service('monkserve', function() {
    var frontend_request = {
        'merchandise': '',
        'week': '',
        'situation': '',
        'expiremonth': '',
        'ccpp': '',
        'strike': '',
        'execute_date': ''
    };;
    var basket = [];
    var removal;

    var CND = function(x) {
            var k;
            if (x < 0.0)
                return 1 - CND(-x);
            else
                k = 1.0 / (1.0 + 0.2316419 * x);
            return 1.0 - Math.exp(-x * x / 2.0) / Math.sqrt(2 * Math.PI) * k * (0.31938153 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429))))
        }
    var cnd = function(x) {
            return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
    }

    var randomNormalDistribution = function() {
        var umt = 0.0,
            vmt = 0.0,
            wmt = 0.0,
            cmt = 0.0;
        do {
            umt = Math.random() * 2 - 1.0;
            vmt = Math.random() * 2 - 1.0;
            wmt = umt * umt + vmt * vmt;
        } while (wmt == 0.0 || wmt >= 1.0) cmt = Math.sqrt((-2 * Math.log(wmt)) / wmt);
        return umt * cmt;
    };

    var getNumber = function(mean, std_dev) {
        return mean + (randomNormalDistribution() * std_dev);
    }

    var bsc = function(S, X, T, r, hl) {
        var d1_x = (Math.log(S / X) + (parseFloat(r) + hl * hl / 2.0) * T) / (hl * Math.sqrt(T));
        var d2_x = d1_x - hl * Math.sqrt(T);
        var Call_x = S * CND(d1_x) - X * Math.exp(parseFloat(-r) * T) * CND(d2_x);
        return Call_x;
    }
    var bsp = function(S, X, T, r, hl) {
        var d1_x = (Math.log(S / X) + (parseFloat(r) + hl * hl / 2.0) * T) / (hl * Math.sqrt(T));
        var d2_x = d1_x - hl * Math.sqrt(T);
        var Put_x = X * Math.exp(parseFloat(-r) * T) * CND(-d2_x) - S * CND(-d1_x);
        return Put_x;
    }

    var Black_Scholes = function(a){
        // console.log(a);
        var s_chg = a[0];
        var s_delta = 0;
        var x_chg = a[1];
        var x_delta = 0;
        var T_chg = a[2];
        var t_delta = 0;
        var r_chg = a[3];
        var r_delta = 0;
        var v_chg = a[4];
        var v_delta = 0;
        switch (a[5]) {
            case "1": //價格//
                var s_chg = a[0] / 2;
                var s_delta = a[0] / 10;
                var x_axis = s_chg;
                var axis_delta = s_delta; //x軸／／
                var xtxt = "現貨價格";
                break;
            case "2": //履約價//
                var x_chg = a[1] / 2;
                var x_delta = a[1] / 10;
                var x_axis = x_chg;
                var axis_delta = x_delta; //x軸／/
                var xtxt = "履約價格";
                break;
            case "3": //到期日期//
                var T_chg = a[2] / 2;
                var t_delta = a[2] / 10;
                var x_axis = T_chg;
                var axis_delta = t_delta; //x軸／/
                var xtxt = "存續期間";
                var tn = 0;
                break;
            case "4": //利率//
                var r_chg = a[3] / 2;
                var r_delta = a[3] / 10;
                var x_axis = r_chg;
                var axis_delta = r_delta; //x軸／／
                var xtxt = "利率%";
                break;
            case "5": //波動度//
                var v_chg = a[4] / 2;
                var v_delta = a[4] / 10;
                var x_axis = v_chg;
                axis_delta = v_delta; //x軸／／
                var xtxt = "波動度%";
                break;
        }
        var data_array=[[],[],[],[],[],[],[],[],[],[],[]];
        for (var i = 0; i < 12; i++) {
            var d1_x = (Math.log(s_chg / x_chg) + (parseFloat(r_chg / 100) + v_chg * v_chg / 20000) * T_chg) / ((v_chg / 100) * Math.sqrt(T_chg));
            var d2_x = d1_x - (v_chg / 100) * Math.sqrt(T_chg);
            var Put_x = parseFloat((x_chg * Math.exp((-r_chg / 100) * T_chg) * CND(-d2_x) - s_chg * CND(-d1_x)).toFixed(2));
            var Call_x = parseFloat((s_chg * CND(d1_x) - x_chg * Math.exp((-r_chg / 100) * T_chg) * CND(d2_x)).toFixed(2));
            var deltac = parseFloat((CND(d1_x)).toFixed(2));
            var deltap = parseFloat((CND(d1_x) - 1).toFixed(2));
            var gammac = parseFloat((cnd(d1_x) / (s_chg * (v_chg / 100) * Math.sqrt(T_chg))).toFixed(6));
            var thetac = parseFloat((((-s_chg * (v_chg / 100) * cnd(d1_x)) / (2 * Math.sqrt(T_chg))) - (r_chg / 100) * x_chg * Math.exp((-r_chg / 100) * T_chg) * CND(d2_x)).toFixed(2));
            var thetap = parseFloat(((-s_chg * (v_chg / 100) * cnd(d1_x)) / (2 * Math.sqrt(T_chg)) + (r_chg / 100) * x_chg * Math.exp(parseFloat(-r_chg / 100) * T_chg) * CND(-d2_x)).toFixed(2));
            var vegac = parseFloat(((cnd(d1_x) * s_chg * Math.sqrt(T_chg)) / 100).toFixed(4));
            var rhoc = parseFloat(((x_chg * T_chg * Math.exp(parseFloat(-r_chg / 100) * T_chg) * CND(d2_x)) / 100).toFixed(4));
            var rhop = parseFloat(((-x_chg * T_chg * Math.exp(parseFloat(-r_chg / 100) * T_chg) * CND(-d2_x)) / 100).toFixed(4));

            var var_array=[deltac,deltap,gammac,vegac,thetac,thetap,rhoc,rhop,Call_x,Put_x,parseFloat(x_axis.toFixed(2))];
            for(var j=0; j<11; j++){
                data_array[j][i]=var_array[j];
            }
            T_chg += t_delta;
            x_chg += x_delta;
            s_chg += s_delta;
            r_chg += r_delta;
            v_chg += v_delta;
            x_axis += axis_delta;
        }
        return [data_array,xtxt];
        // console.log(data_array);
    }

    var Binomial_tree = function(aa){
        var s_chg = aa[0];
        var s_delta = 0;
        var x_chg = aa[1];
        var x_delta = 0;
        var T_chg = aa[2];
        var t_delta = 0;
        var r_chg = aa[3];
        var r_delta = 0;
        var v_chg = aa[4];
        var v_delta = 0;
        var n_chg = aa[5];
        if (aa[5] > 3000) {
            var n_chg = 3000;
        };
        var n_delta = 0;
        switch (aa[6]) {
            case "1": //價格//
                var s_chg = aa[0] / 2;
                var s_delta = aa[0] / 10;
                var x_axis = s_chg;
                var axis_delta = s_delta; //x軸／／
                var xtxt = "現貨價格";
                break;
            case "2": //履約價//
                var x_chg = aa[1] / 2;
                var x_delta = aa[1] / 10;
                var x_axis = x_chg;
                var axis_delta = x_delta; //x軸／/
                var xtxt = "履約價格";
                break;
            case "3": //到期日期//
                var T_chg = aa[2] / 2;
                var t_delta = aa[2] / 10;
                var x_axis = T_chg;
                var axis_delta = t_delta; //x軸／/
                var xtxt = "存續期間";
                var tn = 0;
                break;
            case "4": //利率//
                var r_chg = aa[3] / 2;
                var r_delta = aa[3] / 10;
                var x_axis = r_chg;
                var axis_delta = r_delta; //x軸／／
                var xtxt = "利率%";
                break;
            case "5": //波動度//
                var v_chg = aa[4] / 2;
                var v_delta = aa[4] / 10;
                var x_axis = v_chg;
                axis_delta = v_delta; //x軸／／
                var xtxt = "波動度%";
                break;
            case "6": //n
                if (aa[5] <= 5) {
                    var n_chg = aa[5] - 1;
                    var n_delta = 1;
                } else if (aa[5] <= 100) {
                    var n_chg = aa[5] - 5;
                    var n_delta = 1;
                } else if (aa[5] <= 500) {
                    var n_chg = aa[5] - 50;
                    var n_delta = 10;
                } else if (aa[5] <= 1500) {
                    var n_chg = aa[5] - 250;
                    var n_delta = 50;
                } else {
                    var n_chg = 3000;
                    var n_delta = 50;
                };
                var x_axis = n_chg;
                var axis_delta = n_delta;
                var xtxt = "階數";
                break;
        }
        var calltree = [];
        var calltreeii = [];
        var puttreeii = [];
        var calltreeiii = [];
        var puttreeiii = [];
        var puttree = [];
        var data_array= [[],[],[],[],[],[],[],[],[],[],[],[],[]];
        for (var ifortree = 0; ifortree < 12; ifortree++) {
            var n_chgs = n_chg;
            var dt = T_chg / n_chgs;

            var u = Math.exp((v_chg / 100) * Math.sqrt(dt));
            var d = 1.0 / u;
            var pu = (Math.exp((r_chg / 100) * dt) - d) / (u - d);
            var pd = 1.0 - pu;

            var v_chgii = (v_chg / 100) + 0.01;

            var uii = Math.exp(v_chgii * Math.sqrt(dt));
            var dii = 1.0 / uii;

            var puii = (Math.exp((r_chg / 100) * dt) - dii) / (uii - dii);
            var pdii = 1.0 - puii;

            var r_chgiii = (r_chg / 100) + 0.01;

            var puiii = (Math.exp(r_chgiii * dt) - d) / (u - d);
            var pdiii = 1 - puiii;
            var z = 0;
            while (z <= n_chgs) {
                calltree[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z) - x_chg, 0);
                puttree[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(x_chg - s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z), 0);
                z++;
            };
            while (n_chgs >= 0) {
                n_chgs--;
                z = 0;
                while (z <= n_chgs) {
                    calltree[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z) - x_chg, (pu * calltree[1 + z + 0.5 * (n_chgs + 1) * (n_chgs + 2)] + pd * calltree[1 + (z + 1) + 0.5 * (n_chgs + 1) * (n_chgs + 2)]) * Math.exp(-(r_chg / 100) * dt));
                    puttree[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(x_chg - s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z), (pu * puttree[1 + z + 0.5 * (n_chgs + 1) * (n_chgs + 2)] + pd * puttree[1 + (z + 1) + 0.5 * (n_chgs + 1) * (n_chgs + 2)]) * Math.exp(-(r_chg / 100) * dt));
                    z++;
                }
            }
            var n_chgs = n_chg;
            while (z <= n_chgs) {
                calltreeiii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(s_chg * Math.pow(uii, n_chgs - z) * Math.pow(dii, z) - x_chg, 0);
                puttreeiii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(x_chg - s_chg * Math.pow(uii, n_chgs - z) * Math.pow(dii, z), 0);
                z++;
            };
            while (n_chgs >= 0) {
                n_chgs--;
                z = 0;
                while (z <= n_chgs) {
                    calltreeiii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(s_chg * Math.pow(uii, n_chgs - z) * Math.pow(dii, z) - x_chg, (puii * calltreeiii[1 + z + 0.5 * (n_chgs + 1) * (n_chgs + 2)] + pdii * calltreeiii[1 + (z + 1) + 0.5 * (n_chgs + 1) * (n_chgs + 2)]) * Math.exp(-(r_chg / 100) * dt));
                    puttreeiii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(x_chg - s_chg * Math.pow(uii, n_chgs - z) * Math.pow(dii, z), (puii * puttreeiii[1 + z + 0.5 * (n_chgs + 1) * (n_chgs + 2)] + pdii * puttreeiii[1 + (z + 1) + 0.5 * (n_chgs + 1) * (n_chgs + 2)]) * Math.exp(-(r_chg / 100) * dt));
                    z++;
                }
            }
            var Call_tvega = parseFloat(((calltreeiii[1] - calltree[1]) * 1).toFixed(4));
            var Put_tvega = parseFloat(((puttreeiii[1] - puttree[1]) * 1).toFixed(4));
            var n_chgs = n_chg;
            while (z <= n_chgs) {
                calltreeii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z) - x_chg, 0);
                puttreeii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(x_chg - s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z), 0);
                z++;
            };
            while (n_chgs >= 0) {
                n_chgs--;
                z = 0;
                while (z <= n_chgs) {
                    calltreeii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z) - x_chg, (puiii * calltreeii[1 + z + 0.5 * (n_chgs + 1) * (n_chgs + 2)] + pdiii * calltreeii[1 + (z + 1) + 0.5 * (n_chgs + 1) * (n_chgs + 2)]) * Math.exp(-r_chgiii * dt));
                    puttreeii[1 + z + 0.5 * n_chgs * (n_chgs + 1)] = Math.max(x_chg - s_chg * Math.pow(u, n_chgs - z) * Math.pow(d, z), (puiii * puttreeii[1 + z + 0.5 * (n_chgs + 1) * (n_chgs + 2)] + pdiii * puttreeii[1 + (z + 1) + 0.5 * (n_chgs + 1) * (n_chgs + 2)]) * Math.exp(-r_chgiii * dt));
                    z++;
                }
            }
            var Call_trho = parseFloat(((calltreeii[1] - calltree[1]) * 1).toFixed(4));
            var Put_trho = parseFloat(((puttreeii[1] - puttree[1]) * 1).toFixed(4));
            var Put_t = parseFloat((puttree[1]).toFixed(2));
            var Put_tdelta = parseFloat(((puttree[2] - puttree[3]) / (s_chg * Math.pow(u, 1) - s_chg * Math.pow(d, 1))).toFixed(2));
            var Put_tgamma = parseFloat(((((puttree[4] - puttree[5]) / (s_chg * Math.pow(u, 2) - s_chg)) - ((puttree[5] - puttree[6]) / (s_chg - s_chg * Math.pow(d, 2)))) / (0.5 * 100 * (Math.pow(u, 2) - Math.pow(d, 2)))).toFixed(4));
            var Put_ttheta = parseFloat(((puttree[5] - puttree[1]) / (2 * dt)).toFixed(2));
            var Call_t = parseFloat((calltree[1]).toFixed(2));
            var Call_tdelta = parseFloat(((calltree[2] - calltree[3]) / (s_chg * Math.pow(u, 1) - s_chg * Math.pow(d, 1))).toFixed(2));
            var Call_tgamma = parseFloat(((((calltree[4] - calltree[5]) / (s_chg * Math.pow(u, 2) - s_chg)) - ((calltree[5] - calltree[6]) / (s_chg - s_chg * Math.pow(d, 2)))) / (0.5 * 100 * (Math.pow(u, 2) - Math.pow(d, 2)))).toFixed(4));
            var Call_ttheta = parseFloat(((calltree[5] - calltree[1]) / (2 * dt)).toFixed(2));
            var var_array=[Call_tdelta, Put_tdelta, Call_tgamma, Put_tgamma, Call_tvega, Put_tvega, Call_ttheta, Put_ttheta, Call_trho, Put_trho, Call_t, Put_t, parseFloat(x_axis.toFixed(2))];
            for(var j=0; j<13; j++){
                data_array[j][ifortree]=var_array[j];
            }
            T_chg += t_delta;
            s_chg += s_delta;
            v_chg += v_delta;
            r_chg += r_delta;
            x_chg += x_delta;
            n_chg += n_delta;
            x_axis += axis_delta;
        }

        return [data_array, xtxt];
    }

    var Monte_Carlo = function(a){
        var s_chg = a[0];
        var s_delta = 0;
        var x_chg = a[1];
        var x_delta = 0;
        var T_chg = a[2];
        var t_delta = 0;
        var r_chg = a[3];
        var r_delta = 0;
        var v_chg = a[4];
        var v_delta = 0;
        var n_chg = a[5];
        var n_delta = 0;
        switch (a[6]) {
            case "1": //價格//
                var s_chg = a[0] / 2;
                var s_delta = a[0] / 10;
                var x_axis = s_chg;
                var axis_delta = s_delta; //x軸／／
                var xtxt = "現貨價格";
                break;
            case "2": //履約價//
                var x_chg = a[1] / 2;
                var x_delta = a[1] / 10;
                var x_axis = x_chg;
                var axis_delta = x_delta; //x軸／/
                var xtxt = "履約價格";
                break;
            case "3": //到期日期//
                var T_chg = a[2] / 2;
                var t_delta = a[2] / 10;
                var x_axis = T_chg;
                var axis_delta = t_delta; //x軸／/
                var xtxt = "存續期間";
                var tn = 0;
                break;
            case "4": //利率//
                var r_chg = a[3] / 2;
                var r_delta = a[3] / 10;
                var x_axis = r_chg;
                var axis_delta = r_delta; //x軸／／
                var xtxt = "利率%";
                break;
            case "5": //波動度//
                var v_chg = a[4] / 2;
                var v_delta = a[4] / 10;
                var x_axis = v_chg;
                axis_delta = v_delta; //x軸／／
                var xtxt = "波動度%";
                break;
            case "6": //m
                if (a[5] <= 50) {
                    var n_chg = a[5];
                    var n_delta = 10;
                } else if (a[5] <= 100) {
                    var n_chg = a[5] - 50;
                    var n_delta = 10;
                } else if (a[5] <= 500) {
                    var n_chg = a[5] - 250;
                    var n_delta = 50;
                } else if (a[5] <= 5000) {
                    var n_chg = a[5] - 500;
                    var n_delta = 100;
                } else {
                    n_chg = a[5] - 2500;
                    n_delta = 500;
                };
                var x_axis = n_chg;
                var axis_delta = n_delta;
                var xtxt = "模擬次數";
                break;
        }
        var data_array=[[],[],[]];

        for (var iformt = 0; iformt < 12; iformt++) {
            var putvaluemt = 0, callvaluemt = 0;
            for (var imt = 0; imt < n_chg; imt++) {
                var nmt = getNumber(0, 1);
                var st = s_chg * Math.exp(((r_chg / 100) - v_chg * v_chg / 20000) * T_chg + (v_chg / 100) * Math.sqrt(T_chg) * nmt);
                var payoffcall = Math.exp(-(r_chg / 100) * T_chg) * Math.max(st - x_chg, 0);
                var payoffput = Math.exp(-(r_chg / 100) * T_chg) * Math.max(x_chg - st, 0);
                callvaluemt = callvaluemt + payoffcall;
                putvaluemt = putvaluemt + payoffput;
            }
            var var_array=[parseFloat((callvaluemt / n_chg).toFixed(2)), parseFloat((putvaluemt / n_chg).toFixed(2)), parseFloat(x_axis.toFixed(2))];
            for(var j=0; j<3; j++){
                data_array[j][iformt]=var_array[j];
            }
            T_chg += t_delta;
            s_chg += s_delta;
            v_chg += v_delta;
            r_chg += r_delta;
            x_chg += x_delta;
            n_chg += n_delta;
            x_axis += axis_delta;
        }
        return [data_array, xtxt];
    }

    var implied_volatility = function(a){
        var S = a[0], X=a[1], T=a[2], r=a[3];
        var Targetc = a[4];
        var Targetp = a[5];
        if (!Targetc) {
            var idc = 0
        };
        if (!Targetp) {
            var idp = 0
        };
        var x_chg = X;
        var x_delta = 0;
        var s_chg = S;
        var s_delta = 0;
        var T_chg = T;
        var t_delta = 0;
        var r_chg = r / 100;
        var r_delta = 0;
        var targetc_chg = Targetc;
        var targetc_delta = 0;
        var targetp_chg = Targetp;
        var targetp_delta = 0;
        switch (a[6]) {
            case "1": //exercise
                var x_chg = X / 2;
                var x_delta = X / 10;
                var x_axis = x_chg;
                var axis_delta = x_delta;
                var xtxt = "現貨價格";
                break;
            case "2": //price
                var s_chg = S / 2;
                var s_delta = S / 10;
                var x_axis = s_chg;
                var axis_delta = s_delta;
                var xtxt = "履約價格";
                break;
            case "3": //T
                var T_chg = T / 2;
                var t_delta = T / 10;
                var x_axis = T_chg;
                var axis_delta = t_delta;
                var xtxt = "存續期間";
                var tn = 0;
                break;
            case "4": //rate
                var r_chg = r / 200;
                var r_delta = r / 1000;
                var x_axis = r_chg;
                var axis_delta = r_delta;
                var xtxt = "利率";
                break;
            case "5": //C
                var targetc_chg = Targetc / 2;
                var targetc_delta = Targetc / 10;
                var x_axis = targetc_chg;
                var axis_delta = targetc_delta;
                var xtxt = "買權價格";
                var id = 0;
                break;
            case "6": //p
                var targetp_chg = Targetp / 2;
                var targetp_delta = Targetp / 10;
                var x_axis = targetp_chg;
                var axis_delta = targetp_delta;
                var xtxt = "賣權價格";
                var id = 1;
                break;
        }
        var cateimpvc_array = []; //用來製造x軸的
        var cateimpvp_array = []; //用來製造x軸的
        var impvc = [];
        var impvp = [];
        var sc_chg = s_chg;
        var xc_chg = x_chg;
        var Tc_chg = T_chg;
        var rc_chg = r_chg;
        var xc_axis = x_axis;
        for (var i = 0; i < 12; i++) {
            var high = 1, low = 0;
            while (high - low > 0.00001) {
                if (bsc(sc_chg, xc_chg, Tc_chg, rc_chg, (low + high) / 2) > targetc_chg)
                    high = (low + high) / 2;
                else
                    low = (low + high) / 2;
            }
            var imvc = parseFloat((((high + low) / 2) * 100).toFixed(2));
            impvc.push(imvc);
            cateimpvc_array.push((parseFloat(xc_axis)).toFixed(2));
            Tc_chg += t_delta;
            sc_chg += s_delta;
            targetc_chg += targetc_delta;
            rc_chg += r_delta;
            xc_chg += x_delta;
            xc_axis += axis_delta;
        };
        for (i=0; i < 12; i++) {
            var high = 1, low = 0;
            while (high - low > 0.00001) {
                if (bsp(s_chg, x_chg, T_chg, r_chg, (low + high) / 2) > targetp_chg)
                    high = (low + high) / 2;
                else
                    low = (low + high) / 2;
            }
            var imvp = parseFloat((((high + low) / 2) * 100).toFixed(2));
            impvp.push(imvp);
            cateimpvp_array.push((parseFloat(x_axis)).toFixed(2));
            T_chg += t_delta;
            s_chg += s_delta;
            targetp_chg += targetp_delta;
            r_chg += r_delta;
            x_chg += x_delta;
            x_axis += axis_delta;
        };
        var array=[id, idc, idp];
        return [impvc, impvp, cateimpvc_array, cateimpvp_array, xtxt, array];
    }

    var revise_fr = function(str, val) {
        frontend_request[str] = val;
    }
    //----------------------------------------//
    var dygraph_rest = function owdraw(e) {
        var ctx = e.drawingContext;
        var points = e.points;
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            ctx.beginPath();
            ctx.moveTo(p.canvasx, p.canvasy);
            ctx.lineTo(p.canvasx, p.canvasy);
            ctx.stroke();
        }
    }

    var dygraph_barchart = function(e) {
        var ctx = e.drawingContext;
        var points = e.points;
        var y_bottom = e.dygraph.toDomYCoord(0); // see <a href="http://dygraphs.com/jsdoc/symbols/Dygraph.html#toDomYCoord">jsdoc</a>
        // This should really be based on the minimum gap
        var bar_width = 2 / 3 * (points[1].canvasx - points[0].canvasx);
        ctx.fillStyle = e.color; // a lighter shade might be more aesthetically pleasing

        // Do the actual plotting.
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var center_x = p.canvasx; // center of the bar

            ctx.fillRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy);
            ctx.strokeRect(center_x - bar_width / 2, p.canvasy, bar_width, y_bottom - p.canvasy);
        }
    }

    //----------------------------------------//
    var zoomin_chg = function(gs, min, max, me) {
        var initial_start_time = Date.now();
        // console.log(gs);
        // console.log(me);
        for (var i = 0; i < gs.length; i++) {
            if (gs[i] == me) continue;
            // console.log(Date.now()-initial_start_time);
            gs[i].updateOptions({
                dateWindow: [min, max + 1],
            });
            // console.log(Date.now()-initial_start_time);

        }
        // console.log(Date.now()-initial_start_time);
    }

    var synchronization = function(gs) {
        for (var j = 0; j < gs.length; j++) {
            gs[j].updateOptions({
                highlightCallback: function(event, x, points, row, seriesName) {
                    var me = this;
                    for (var i = 0; i < gs.length; i++) {
                        if (me == gs[i]) continue; //如果是一樣的就跳過
                        var idx = gs[i].rawData_[x][1];
                        if (idx !== null) {
                            gs[i].setSelection(x);
                        }
                    }
                },
                unhighlightCallback: function(event) {
                    var me = this;
                    for (var i = 0; i < gs.length; i++) {
                        if (me == gs[i]) continue;
                        gs[i].clearSelection();
                    }
                },
                zoomCallback: function(min, max, yRange) {
                    zoomin_chg(gs, Math.round(min), Math.round(max), this);
                }
            });
        }
    }

    //----------------------------------------//
    var getget = function() {
        console.log(hot.getData());
    }

    //----------------------------------------//
    var optProfit = function (spot,strike,price,bs,cp) {
        // console.log(spot,strike,price,bs,cp)
      // return (spot-strike)*cp>0 ? (spot-strike+price)*bs*cp : - price * bs;
      if((spot-strike)*cp>0){
        return cp>0 ? (spot-strike-price)*bs*cp : (spot-strike+price)*bs*cp;
      }else{
        return - price * bs
      }
    }

    var testUnit = function (opttactic){
      var incre = opttactic.unitQ*2,pbar=[];
      for (var step=0;step<=incre;step++){
        var profit=0;
        for (var straSet in opttactic.result){
            // console.log(opttactic.result[straSet])
          var gauge =
          Math.floor(opttactic.result[straSet][0][0]/opttactic.unit) - opttactic.unitQ;
          var fut = (gauge + step)*opttactic.unit;
          for (var each in opttactic.result[straSet]){
            // console.log(opttactic.result[straSet][each])
            profit+=optProfit(fut,
              opttactic.result[straSet][each][1],
              opttactic.result[straSet][each][2],
              opttactic.result[straSet][each][3],
              opttactic.result[straSet][each][4]
            );
          }
        }
        pbar.push([fut,profit]);
      }
      // console.log(pbar);
      var greeks=[];
      opttactic.result.filter(function(strategy){
        // console.log(strategy);
        strategy.forEach(function(element, key) {
          greeks.push(element[5]);
        });
      });

      return [pbar,greeks];
    }
    // var optstrategy = function
    //----------------------------------------//
    function Para (name,type,chinese) {
      var baro = this;
      baro.name = name;
      baro.type = type;
      baro.chinese = chinese;
    };
    var option_strategy={
      "看多":[
          new Para('reversals', '看多', '逆轉換選擇權(reversals)'),
          new Para('reversecoveredcall', '看多', '反掩護型買權(reversecoveredcall)'),
          new Para('reverseprotectiveput', '看多', '反保護性賣權(reverseprotectiveput)'),
          new Para('ratioback', '看多', '逆比率選擇權(ratioback)'),
          new Para('bullspread', '看多', '多頭價差選擇權(bullspread)'),
        ],
      "看空":[
          new Para('conversions', '看空', '轉換選擇權(conversions)'),
          new Para('coveredcall', '看空', '掩護性買權(coveredcall)'),
          new Para('protectiveput', '看空', '保護性賣權(protectiveput)'),
          new Para('ratio', '看空', '選擇權比率(ratio)'),
          new Para('bearspread', '看空', '空頭價差選擇權(bearspread)'),
        ],
      "盤整":[
          new Para('straddle', '盤整', '跨式選擇權(straddle)'),
          new Para('strangle', '盤整', '勒式選擇權(strangle)'),
          new Para('butterfly', '盤整', '蝶式選擇權(butterfly)'),
          new Para('condor', '盤整', '兀鷹選擇權(condor)'),
        ],
      "突破":[
          new Para('straddle', '突破', '跨式選擇權(straddle)'),
          new Para('strangle', '突破', '勒式選擇權(strangle)'),
          new Para('butterfly', '突破', '蝶式選擇權(butterfly)'),
          new Para('condor', '突破', '兀鷹選擇權(condor)'),
        ],
    };
    var realchart = function (data,name,unit,data_all){
        // console.log(data,name);
        var title = name[0]["cp"];
        var buy_sell = name[0]["bs"];
        var strike = name[0]["strike"];
        var series = [];
        for (var i = 0; i < data.length; i++) {
            series.push({
                "type": "line",
                "name": buy_sell[i]+"~"+title[i]+"履約價"+strike[i],
                "unit": "點",
                "lineWidth": 2,
                "dataGrouping": {
                  enabled: false
                },
                "yAxis": 0 ,
                "data": data[i],
            });
        }
        series.push({
            "type": "column",
            "name": "合計損益",
            "unit": "點",
            "lineWidth": 2,
            "dataGrouping": {
              enabled: false
            },

            "yAxis": 0 ,
            "data": data_all,
        });
        // console.log(series);
        return series;
    };
    var realstrike_chart = function (data,name,unit,data_para){
        // console.log(data);
        var title = name[0]["cp"];
        var buy_sell = name[0]["bs"];
        var strike = name[0]["strike"];
        var para = ["delta","gamma","theta"];

        var series = [];
        for (var i = 0; i < data.length; i++) {
            series.push({
                "type": "line",
                "name": buy_sell[i]+"~"+title[i]+"履約價"+strike[i],
                "unit": "點",
                "lineWidth": 2,
                "dataGrouping": {
                  enabled: false
                },
                "yAxis": 0 ,
                "data": data[i],
            });
        }
        for(var i = 8; i < data_para.length; i++){
            series.push({
                "type": "column",
                "name": para[i-8],
                "unit": "點",
                "lineWidth": 2,
                "dataGrouping": {
                  enabled: false
                },

                "yAxis": 0 ,
                "data": data_para[i],
            });
        }
        // console.log(series);
        return series;
    };
    var realchart_futures = function(data) {
        // console.log(data);
        var series = [{
          "type": "candlestick",
          "id": "dataseries",
          "name": "指數",
          "dataGrouping": {
            enabled: false
          },
          "color": '#1dcc92',
          "lineWidth": 0.5,
          "yAxis": 0,
          "unit": "",
          "data": data,
          "upColor": "#ff433d"
        }];
        return series;
    }
    var realchart_yAxis = function (name){
        var yAxis = [{
          "title": {
            offset: 20,
            rotation: 0,
            align: 'high',
            text: name,
            style: {
              color: 'yellow'
            },
          },
          "tickPixelInterval": 50,
          "labels": {
            align: 'right',
            'format': "{value}點"
          },
          "opposite": false,
          "lineWidth": 2,
          "height": 150,
          "offset": 0,
          "lineColor": 'white'
        }];
        // console.log(yAxis);
        return yAxis;
    };
    var realchart_tooltip =function(){
        var tooltip = {
            crosshairs: true,
            // shared: true,
            borderColor: '#53aa27',
            // valueDecimals: 5,
            borderWidth: 3,
            borderRadius: 8,
            headerFormat: '<b>{point.key}</b><br/>',
            // pointFormat: '{series.name}: <b>{point.y}點</b>',
            style:{
                "fontSize": "18px",
            },
            valueSuffix: ' 點',
        };

        return tooltip;
    }
    return {
        CND: CND,
        cnd: cnd,
        option_strategy,option_strategy,
        randomNormalDistribution: randomNormalDistribution,
        getNumber: getNumber,
        bsc: bsc,
        bsp: bsp,
        Black_Scholes: Black_Scholes,
        Binomial_tree: Binomial_tree,
        Monte_Carlo: Monte_Carlo,
        implied_volatility: implied_volatility,

        frontend_request: frontend_request,
        revise_fr: revise_fr,
        basket: basket,
        removal: removal,

        dygraph_rest: dygraph_rest,
        dygraph_barchart: dygraph_barchart,

        zoomin_chg: zoomin_chg,
        synchronization: synchronization,

        getget: getget,
        optProfit: optProfit,
        testUnit: testUnit,
        realchart:realchart,
        realstrike_chart:realstrike_chart,
        realchart_futures:realchart_futures,
        realchart_yAxis:realchart_yAxis,
        realchart_tooltip: realchart_tooltip,
    }
})


//*******************************************************

monk.directive("tttDdd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      optmodelfunc:"=optmodelfunc",
      receiver:"@receiver",
    },
    link: function(scope){
        // console.log(scope)
      var name = scope.receiver;
      if (name == "reversals" || name == "conversions"){
        name = "rever_conver";
      }else if (name == "coveredcall" || name == "reversecoveredcall" || name == "protectiveput" || name == "reverseprotectiveput") {
        name = "cover_protect";
      }else if (name == "bullspread" || name == "bearspread") {
        name = "bullbear";
      }else if (name == "ratioback") {
        name = "ratio";
      }
      // console.log(name);
      scope.myTemplate = '../templates/calculate/optStra/strategy/'+name+'.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }//imp
}).directive("2nfDd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      agent:"@agent",
      agentname:"@agentname",
      optionagent:"=optionagent",
      ngfir:"@ngfir",
      ngsec:"@ngsec",
    },
    link: function(scope){
      scope.myTemplate = '../templates/calculate/optStra/element/2nofunc.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }
}).directive("2fDd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      agent:"@agent",
      agentname:"@agentname",
      para:"@para",
      optionagent:"=optionagent",
      optmodelfunc:"=optmodelfunc",
    },
    link: function(scope){
      scope.myTemplate = '../templates/calculate/optStra/element/2func.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }
}).directive("1fDd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      agent:"@agent",
      agentname:"@agentname",
      para:"@para",
      optionagent:"=optionagent",
      optmodelfunc:"=optmodelfunc",
    },
    link: function(scope){
      scope.myTemplate = '../templates/calculate/optStra/element/1func.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }
}).directive("1fmDd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      agent:"@agent",
      agentname:"@agentname",
      optionagent:"=optionagent",
      optmodelfunc:"=optmodelfunc",
      ngno:"@ngno",
    },
    link: function(scope){
      scope.myTemplate = '../templates/calculate/optStra/element/1funcmodel.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }
}).directive("3fmDd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      agentname:"@agentname",
      optionagent:"=optionagent",
      optmodelfunc:"=optmodelfunc",
    },
    link: function(scope){
      scope.myTemplate = '../templates/calculate/optStra/element/3funcmodel.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }
}).directive("psDd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      agentname:"@agentname",
      optionagent:"=optionagent",
      optmodelfunc:"=optmodelfunc",
      ngno:"@ngno",
      agent:"@agent",
    },
    link: function(scope){
      scope.myTemplate = '../templates/calculate/optStra/element/nfuncmodel.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }
}).directive("pictDd" , function() {
  return {
    restrict:"EA",
    scope:{
      opttactic:"=opttactic",
      slider:"=slider",
    },
    link: function(scope){
      scope.myTemplate = '../templates/calculate/optStra/chart.html';
    },
    template:"<div ng-include='myTemplate'></div>",
  }
});

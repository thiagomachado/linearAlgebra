import * as utils from "./utils.js";
import * as basic from "./matrix_basic_operations.js"

var n = 0;
var teta1 = 0;
var teta2 = 0;
var result_x = [];
var tolerance = 0;
var x0 = [1,0,0];

$(() => {
    
    $('#teta-1').bind('input propertychange', function() {
          teta1 = parseFloat(this.value)
    })

    $('#teta-2').bind('input propertychange', function() {
        teta2 = parseFloat(this.value)
    })

    $("#max-tolerance").bind('input propertychange', function() {
        tolerance = parseFloat(this.value)
    })

    $('#solve').click(function() {
        if ( isNaN(teta1)  || isNaN(teta2)){
            print_error('Teta1 and Teta2 are required.')
        }else if (tolerance <= 0){
            print_error('Tolerance must be greater than 0.')
        }else{
        solve()}
    })

    function solve(){
        $('#error-div').empty()
        redraw_result_table()
        switch ($('#icod').val()){
            case "1":               
                result_x = get_newton()
                break
            case "2":
                result_x = get_broyden()
                break
        }

    }

    function get_newton(){
        var k = Number.MAX_SAFE_INTEGER
        var max_iter = 200
        var x = x0
        var Jacobian = []
        draw_result_x(0,x[0],x[1],x[2],"-")
        while(k > tolerance){
            if (max_iter < 0){
                print_error("Convergence not reached")
                return "Error"
            }
            Jacobian = get_jacobian(x[0],x[1],x[2])
            var JacobianInv = utils.inverse(basic.clone(Jacobian))
            var F = get_function_vector(x[0],x[1],x[2])
            var dX = basic.multiply_matrix_scalar(basic.multiply_matrix(JacobianInv,F,true),-1, false)
            var xnext = basic.sum_matrix(x, dX, true)
            k = basic.norm_vector(dX)/basic.norm_vector(x)
            x = xnext
            max_iter -= 1
            draw_result_x(200-max_iter, x[0],x[1],x[2],k)
        }
        return x
        
    }

    function get_broyden(){
        var k = Number.MAX_SAFE_INTEGER
        var max_iter = 300
        var x = x0
        var Jacobian = get_jacobian(x[0],x[1],x[2])
        var B = basic.clone(Jacobian)
        var F = get_function_vector(x[0],x[1],x[2])
        draw_result_x(0,x[0],x[1],x[2],"-")

        while(k > tolerance){
            if (max_iter < 0){
                print_error("Convergence not reached")
                return "Error"
            }
            Jacobian = B
            var JacobianInv = utils.inverse(basic.clone(Jacobian))
            
            var dX = basic.multiply_matrix_scalar(basic.multiply_matrix(JacobianInv,F,true),-1, false)
            var xnext = basic.sum_matrix(x, dX, true)
            var Fnext = get_function_vector(xnext[0], xnext[1], xnext[2])
            k = basic.norm_vector(dX)/basic.norm_vector(x)
            x = xnext
            max_iter -= 1
            var Y = basic.sum_matrix(Fnext, basic.multiply_matrix_scalar(F,-1,true),true)
            var dXT = basic.get_transposed(dX, false)
            var BdX = basic.multiply_matrix(Jacobian, dX, false)
            var negativeBdx = basic.multiply_matrix_scalar(BdX, -1, false)
            var YBdX = basic.sum_matrix(Y, negativeBdx, true)
            var numerator = basic.multiply_matrix(YBdX, dXT, false)
            var denominator = basic.multiply_matrix(dXT,dX, false)
            var aux = []
            for (let i=0; i<numerator.length; i++){
                var row = []
                for (let j=0; j<numerator.length; j++){
                    var d = numerator[i][j]/denominator[i][j]
                    row.push(d)
                }
                aux.push(row)
            }
            B = basic.sum_matrix(B, aux, false)
            draw_result_x(300-max_iter, x[0],x[1],x[2],k)
        }
        return x

    }

    function get_jacobian(c2, c3, c4){
        
        var l1 = [2*c2,4*c3,12*c4]
        var l2 = [((12*c3*c2) + (36*c3*c4)), ((24*c3**2) + (6*c2**2) +(36*c2*c4) + (108*c4**2)) , (36*c3*c2) + (216*c3*c4)]
        var l3 = [ 
                ((120*(c3**2)*c2) + (576*c3**2*c4) + (454*(c4**2)*c2) + (1296*(c4**3)) + (72*(c2**2)*c4) + 3),
                ((240*c3**3) + (120*c3*c2**2) + (1152*c3*c2*c4) +  (4464*c3*c4**2)),
                ((576*c3**2*c2) + (4464*c3**2*c4) + (504*c4*c2**2) + (3888*c4**2*c2) + (13392*c4**3) + (24*c2**3))
            ]
        
        return [l1,l2,l3]
    }

    function get_function_vector(c2, c3, c4){
        var l1 = [c2**2+2*c3**2+6*c4**2 - 1.0]
        var l2 = [8*c3**3 + 6*c3*c2**2 + 36*c2*c3*c4 + 108*c3*c4**2 - teta1]
        var l3 = [(60*c3**4 + 60*c3**2*c2**2 + 576*c3**2*c4*c2 + 2232*c3**2*c4**2 + 252*c4**2*c2**2 + (1296*(c4**3)*c2) + (3348*(c4**4) + (24*(c2**3)*c4))+(3*c2)) - teta2]
        
        return [l1,l2,l3]
    }

    function print_error(error_message){
        $('#error-div').empty()
        $('#error-div').append('<div class="alert alert-danger" role="alert">' + error_message +'</div>')
    }

    function redraw_result_table(){
        $('#vector-x-table-body').empty()
        $('#vector-x-table-head').empty()
        $('#vector-x-table-head').append('<tr><th>Iter</th><th>X</th><th>Y</th><th>Z</th><th>tol</th></tr>')
    }

    function draw_result_x(iter,X,Y,Z,tol){
        
        $('#vector-x-table-body').append('<tr id="vector-x-row'+iter+'">')
        $('#vector-x-row'+iter).append('<td>'+iter+'</td>')
        $('#vector-x-row'+iter).append('<td>'+X+'</td>')
        $('#vector-x-row'+iter).append('<td>'+Y+'</td>')
        $('#vector-x-row'+iter).append('<td>'+Z+'</td>')
        $('#vector-x-row'+iter).append('<td>'+tol+'</td>')
        $('#vector-x-table-body').append('</tr>')
    }

}
)



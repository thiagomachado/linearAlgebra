import * as utils from "./utils.js";
import * as basic from "./matrix_basic_operations.js"

var n = 0;
var matrix_a = [];
var vector_b = [];
var result_x = [];
var tolerance = 0;

$(() => {
    
    $('#matrix-order').bind('input propertychange', function() {
        n = Math.floor(this.value)
        init_vector_b_matrix_a()
        
        if(n <= 30){
            draw_matrix_a()
            draw_vector_b()
        }       
    })

    $('#matrix-a-elements').bind('input propertychange', function() {
        var matrix_elements = read_vector(this.value)
        if (matrix_elements.length == n*n){
            $('#error-div').empty()
            var line=0
            var count = 0
            for(let k = 0; k<matrix_elements.length; k++){
                var column = k%n
                matrix_a[line][column] = parseFloat(matrix_elements[k])
                count += 1
                if(count == n){
                    count = 0
                    line +=1
                }              
                draw_matrix_a()                
            }
        }else{
            print_error('Expected ' + n*n + ' elements in matrix A, but found '+matrix_elements.length)
        }
    })

    
    $('#vector-b-elements').bind('input propertychange', function() {
        var vector_elements = read_vector(this.value)
        if (vector_elements.length == n){
            $('#error-div').empty()

            for(let k = 0; k<vector_elements.length; k++){
                vector_b[k] = parseFloat(vector_elements[k])                             
                draw_vector_b()                
            }
        }else{
            print_error('Expected ' + n + ' elements in vector B, but found '+vector_elements.length)
        }
    })

    $("#max-tolerance").bind('input propertychange', function() {
        tolerance = parseFloat(this.value)
    })

    $('#solve').click(function() {solve()})

    function init_vector_b_matrix_a(){
        matrix_a = new Array(n)
        vector_b = new Array(n)
        for (let i = 0; i < n; i++){
            vector_b[i] = 0
            matrix_a[i] = new Array(n)
            for(let j = 0; j<n; j++){
                matrix_a[i][j] = 0
            }
        }
    }

    function draw_matrix_a(){
        $('#matrix-a-table-body').empty()
        $('#matrix-a-table-head').empty()
        $('#matrix-a-table-head').append('<tr><th scope="col" colspan="'+n+'"> Matrix A '+n+'x'+n+'</th></tr>')
        for(let i = 0; i < n; i++){
            $('#matrix-a-table-body').append('<tr id="matrix-a-row-'+i+'">')
            for(let j = 0; j<n; j++){
                 $('#matrix-a-row-'+i).append('<td>'+matrix_a[i][j]+'</td>')  
            }
            $('#matrix-a-table-body').append('</tr>')
        }
    }

    function draw_vector_b(){
        $('#vector-b-table-body').empty()
        $('#vector-b-table-head').empty()
        $('#vector-b-table-head').append('<tr><th scope="col" colspan="'+n+'"> Vector B</th></tr>')
        $('#vector-b-table-body').append('<tr id="vector-b-row">')
        for(let i = 0; i < n; i++){
            $('#vector-b-row').append('<td>'+vector_b[i]+'</td>')
        }
        $('#vector-b-table-body').append('</tr>')
    }

    function read_vector(text_separeted_comma){
        return text_separeted_comma.split(",")
    }

    function print_error(error_message){
        $('#error-div').empty()
        $('#error-div').append('<div class="alert alert-danger" role="alert">' + error_message +'</div>')
    }

    function draw_result_x(){
        $('#vector-x-table-body').empty()
        $('#vector-x-table-head').empty()
        $('#vector-x-table-head').append('<tr><th scope="col" colspan="'+n+'"> Result X</th></tr>')
        $('#vector-x-table-body').append('<tr id="vector-x-row">')
        for(let i = 0; i < n; i++){
            $('#vector-x-row').append('<td>'+result_x[i]+'</td>')
        }
        $('#vector-x-table-body').append('</tr>')
    }

    function draw_determinant(determinant){
        $('#determinant-text').empty()
        if ($("#check-determinant")[0].checked)
            $('#determinant-text').append('<p> Determinant: '+determinant+' </p>')
    }

    function solve(){
        switch ($('#icod').val()){
            case "1":
                result_x = lu_decomposition()
                break
            case "2":
                result_x = cholesky_decomposition()
                break
            case "3":
                result_x = jacobi_iterative()
                break
        }

        if(result_x != "Error")
            draw_result_x()

    }

    function lu_decomposition(){
        var determinant = utils.get_determinant(matrix_a)
        if (determinant == 0){
            print_error("Matrix can not be singular.")
            return "Error"
        }

        var result = basic.clone(matrix_a)
        for(let k = 0; k < n; k++){
            for(let i = k+1; i < n; i++){
                if(result[k][k] == 0){
                    print_error("Matrix needs pivoting")
                    return "Error"
                }
                result[i][k] = result[i][k]/result[k][k]
            }
            for(let j= k+1; j < n; j++){
                for(let i = k+1; i < n; i++){
                    result[i][j] = result[i][j]-result[i][k]*result[k][j]
                }
            }
    
        }

        let matrix_l = []
        let matrix_u = []
        for(let i = 0; i < n; i++){
            let row_l = []
            let row_u = []
            for(let j = 0; j < n; j++){
                if(i==j){
                    row_l.push(1)
                    row_u.push(result[i][j])
                }if(i>j){
                    row_l.push(result[i][j])
                    row_u.push(0)
                }if(i<j){
                    row_u.push(result[i][j])
                    row_l.push(0)
                }
            }
            matrix_l.push(row_l)
            matrix_u.push(row_u)
        }

        console.log({L:matrix_l, U:matrix_u})
        let vector_y = utils.forward_substitution(matrix_l, vector_b)
        let vector_x = utils.backward_substitution(matrix_u, vector_y)
        
        draw_determinant(determinant)
        return vector_x
    }
    
    function cholesky_decomposition(){
        var determinant = utils.get_determinant(matrix_a)
        if (determinant <= 0 || !utils.is_positive_definite(matrix_a)){
            print_error("Matrix should be positive definite.")
            return "Error"
        }

        var matrix_l = new Array(n)
        
        for (let i = 0; i < n; i++){
            matrix_l[i] = new Array(n)
            for(let j = 0; j<n; j++){
                matrix_l[i][j] = 0
            }
        }

        for(let i=0; i<matrix_a.length; i++){
            for(let j=0; j < i + 1; j++){
                let summation_principal = 0
                let summation = 0
                for(let k = 0; k <= i; k++){
                    if (i == j){
                        summation_principal += matrix_l[i][k]**2
                    }
                    summation += matrix_l[i][k] * matrix_l[j][k]
                }
                if(i == j){
                    matrix_l[i][j] = +(Math.round((matrix_a[i][j]-summation_principal)**0.5  + "e+2")  + "e-2")
                }else{
                    matrix_l[i][j] = +(Math.round((1.0/matrix_l[j][j])*(matrix_a[i][j]-summation) + "e+2")  + "e-2")
                }

            }
        }

        let matrix_u = basic.get_transposed(matrix_l, false)
        
        console.log({L:matrix_l, U:matrix_u})
        let vector_y = utils.forward_substitution(matrix_l, vector_b)
        let vector_x = utils.backward_substitution(matrix_u, vector_y)

        draw_determinant(determinant)
        return vector_x
    }

    function jacobi_iterative(){
        if(!utils.is_diagonal_dominant(matrix_a)){
            print_error("Matrix should be diagonal dominant.")
            return "Error"
        }
        let residue = 1
        let step = 0
        let dimension = matrix_a.length
        let previous_solution = []
        let solution = []

        for (let i = 0; i < dimension; i++){
            previous_solution.push(1)
            solution.push(0)
        }

        while(residue > tolerance){
            let numerator = 0
            let denominator = 0

            for (let i = 0; i < dimension; i++){
                solution[i] = vector_b[i]

                for (let j = 0; j < dimension; j++){
                    if(i != j){
                        solution[i] += (-1)*(matrix_a[i][j] * previous_solution[j])
                    }
                }
                solution[i] = solution[i]/ matrix_a[i][i]
            }

            for (let i = 0; i < dimension; i++){
                numerator += (solution[i] - previous_solution[i])**2
                denominator += solution[i]**2
            }

            residue = numerator**0.5 / denominator**0.5
            for (let i = 0; i < dimension; i++){
                previous_solution[i] = solution[i]
            }
            step += 1

            console.log({step:step, residue:residue, solution:solution})
        }
        if ($("#check-determinant")[0].checked)
            draw_determinant(utils.get_determinant(matrix_a))
        return solution
    }

}
)



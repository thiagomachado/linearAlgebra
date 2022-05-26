import * as utils from "./utils.js";
import * as basic from "./matrix_basic_operations.js"
var n = 0;
var matrix_a = [];
var vector_b = [];
var result_x = [];

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
                result[i][k] = result[i][k]/result[k][k]
            }
            for(let j= k+1; j < n; j++){
                for(let i = k+1; i < n; i++){
                    result[i][j] = result[i][j]-result[i][k]*result[k][j]
                }
            }
    
        }
        let vector_y = utils.forward_substitution(result, vector_b)
        let vector_x = utils.backward_substitution(basic.get_transposed(result), vector_y)
        
        draw_determinant(determinant)
        return vector_x
    }    

}
)



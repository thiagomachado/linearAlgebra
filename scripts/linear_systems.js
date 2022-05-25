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
        matrix_elements = read_vector(this.value)
        if (matrix_elements.length == n*n){
            $('#error-div').empty()
            line=0
            count = 0
            for(let k = 0; k<matrix_elements.length; k++){
                column = k%n
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
        vector_elements = read_vector(this.value)
        if (vector_elements.length == n){
            $('#error-div').empty()

            for(k = 0; k<vector_elements.length; k++){
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
        for(i = 0; i < n; i++){
            $('#matrix-a-table-body').append('<tr id="matrix-a-row-'+i+'">')
            for(j = 0; j<n; j++){
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
        for(i = 0; i < n; i++){
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
        $('#vector-x-table-head').append('<tr><th scope="col" colspan="'+n+'"> Result</th></tr>')
        $('#vector-x-table-body').append('<tr id="vector-x-row">')
        for(i = 0; i < n; i++){
            $('#vector-x-row').append('<td>'+result_x[i]+'</td>')
        }
        $('#vector-x-table-body').append('</tr>')
    }

    function solve(){
        switch ($('#icod').val()){
            case "1":
                result_x = lu_decomposition()
        }
        
        draw_result_x()

    }    

}
)

function lu_decomposition(){
    let result = [...matrix_a]
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
    let vector_y = forward_substitution(result, vector_b)
    let vector_x = backward_substitution(get_transposed(result), vector_y)
    return vector_x
}

function forward_substitution(matrix, vector){
    n_rows = matrix.length
    vector_y = new Array(n_rows)
    
    vector_y[0] = vector[0]

    for(let i=0; i<n_rows;i++)
    {
        accumulation = vector[i]
        for(let j=0; j<i; j++){
            accumulation -= matrix[i][j] * vector_y[j]
        }
        vector_y[i] = accumulation
    }
    return vector_y
}

function backward_substitution(matrix, vector_y){
    n_rows = matrix.length
    vector_x = new Array(n_rows)
    vector_x[ n_rows-1] = vector_y[n_rows-1] /matrix[n_rows-1][n_rows-1]
    for (let i = (n_rows - 2); i >= 0; i--) {
        accumulation = vector_y[i]
        for(let j=i+1; j<n_rows; j++){
            accumulation -= matrix[i][j] * vector_x[j] 
        }
        vector_x[i] = accumulation/matrix[i][i]
    }
    return vector_x
}

function get_transposed(matrix){
    n_rows = matrix.length
    transposed = new Array(n_rows)
    for(let i=0; i<n_rows;i++){
        transposed[i] = new Array(n_rows)
        for(let j=0;j<n_rows;j++){
            transposed[i][j] = matrix[j][i]
        }
    }    
    return transposed
}
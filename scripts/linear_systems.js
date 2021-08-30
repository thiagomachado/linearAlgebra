$(() => {
    var n = 0;
    var matrix_a = [];
    var vector_b = [];
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
            for(k = 0; k<matrix_elements.length; k++){
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
    function init_vector_b_matrix_a(){
        matrix_a = new Array(n)
        vector_b = new Array(n)
        for (i = 0; i < n; i++){
            vector_b[i] = 0
            matrix_a[i] = new Array(n)
            for(j = 0; j<n; j++){
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


})
  
function clone(matrix){
    var matrix_copy = []
    for (let i = 0; i<matrix.length;i++){
        var copy_row = [...matrix[i]]
        matrix_copy.push(copy_row)
    }
    return matrix_copy
}

function get_identity(dimension){
    let identity = [];
        for (let i = 0; i < dimension; i++) {
            let row = [];
            
            for (let j = 0; j < dimension; j++) {
                row.push((i == j)? 1: 0);
            }
            
            identity.push(row)
        }
        
        return identity;
}

function get_transposed(matrix){
    var n_rows = matrix.length
    var transposed = new Array(n_rows)
    for(let i=0; i<n_rows;i++){
        transposed[i] = new Array(n_rows)
        for(let j=0;j<n_rows;j++){
            transposed[i][j] = matrix[j][i]
        }
    }    
    return transposed
}

//A+B = C. Sum of each correspondent element
function sum_matrix(matrix_a, matrix_b){
    let matrix_c = [];
        
    let n_rows_c = matrix_a.length;
    let n_columns_c = matrix_a[0].length;

    for (let i = 0; i < n_rows_c; i++) {
        let row = [];
        
        for (let j = 0; j < n_columns_c; j++) {
            row.push(matrix_a[i][j] + matrix_b[i][j]);
        }
        
        matrix_c.push(row);
    }
    
    return matrix_c;
}

//A - B = C
function subtract_matrix(matrix_a, matrix_b){
    let matrix_c = [];
        
    let n_rows_c = matrix_a.length;
    let n_columns_c = matrix_a[0].length;

    for (let i = 0; i < n_rows_c; i++) {
        let row = [];
        
        for (let j = 0; j < n_columns_c; j++) {
            row.push(matrix_a[i][j] - matrix_b[i][j]);
        }
        
        matrix_c.push(row);
    }
    
    return matrix_c;
}

//A*B = C
function multiply_matrix(matrix_a, matrix_b, is_b_vector){
    let matrix_c = [];
    
    let rCount = matrix_a.length;
    var cCount = matrix_b[0].length;
    if(is_b_vector){
        cCount = matrix_b.length;
    }

    for (let i = 0; i < rCount; i++) {
        let row = [];
        let row_matrix_a = matrix_a[i];
        
        for (let j = 0; j < cCount; j++) {
            
            let cell = 0;
            for (let k = 0; k < rCount; k++) {
                
                if(is_b_vector){
                    cell = cell + row_matrix_a[k] * matrix_b[k];}
                else{
                    cell = cell + row_matrix_a[k] * matrix_b[k][j];
                }
            }
            
            row.push(cell);
        }
        
        matrix_c.push(row);
    }
    
    return matrix_c;
}

export {sum_matrix, subtract_matrix, multiply_matrix, get_identity, get_transposed, clone}
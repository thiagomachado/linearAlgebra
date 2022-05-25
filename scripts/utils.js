export function hello() {
    return "Hello";
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

function forward_substitution(matrix, vector){
    var n_rows = matrix.length
    var vector_y = new Array(n_rows)
    
    vector_y[0] = vector[0]

    for(let i=0; i<n_rows;i++)
    {
        var accumulation = vector[i]
        for(let j=0; j<i; j++){
            accumulation -= matrix[i][j] * vector_y[j]
        }
        vector_y[i] = accumulation
    }
    return vector_y
}

function backward_substitution(matrix, vector_y){
    var n_rows = matrix.length
    var vector_x = new Array(n_rows)
    
    vector_x[ n_rows-1] = vector_y[n_rows-1] /matrix[n_rows-1][n_rows-1]
    
    for (let i = (n_rows - 2); i >= 0; i--) {
        var accumulation = vector_y[i]
        for(let j=i+1; j<n_rows; j++){
            accumulation -= matrix[i][j] * vector_x[j] 
        }
        vector_x[i] = accumulation/matrix[i][i]
    }
    return vector_x
}

export {backward_substitution, forward_substitution, get_transposed}
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

function get_determinant(matrix) {
    var n = matrix.length;
    var determinant = 0;
    switch (n){
        case 1:
            determinant = matrix[0][0];
            break;
        case 2:
            determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
            break;
        default:
            for (var j = 0; j < n; j++) {
                determinant += matrix[0][j] * cofactor(matrix, j);
            }
        }

    return determinant;
}

function cofactor(matrix, column) {
    var sub_matrix = [];
    var n = matrix.length;
    var m = 0;

    for (var i = 1; i < n; i++) {
        sub_matrix[m] = [];

        for (var j = 0; j < n; j++) {
            if (j !== column) {
                sub_matrix[m].push(matrix[i][j]);
            }
        }
        m++;
    }

    return (column % 2 ? -1 : 1) * get_determinant(sub_matrix);
}

export {backward_substitution, forward_substitution, get_determinant}
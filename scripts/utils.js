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
    
    vector_x[ n_rows-1] = +(Math.round((vector_y[n_rows-1] /matrix[n_rows-1][n_rows-1]) + "e+2")  + "e-2")
    
    for (let i = (n_rows - 2); i >= 0; i--) {
        var accumulation = vector_y[i]
        for(let j=i+1; j<n_rows; j++){
            accumulation -= matrix[i][j] * vector_x[j] 
        }
        vector_x[i] = +(Math.round((accumulation/matrix[i][i]) + "e+2")  + "e-2")
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


function is_positive_definite(matrix){
    return (is_simetric(matrix) && sylvesters_criterion(matrix))   
}

function is_simetric(matrix){
    for (let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix.length; j++){
            if(matrix[i][j] != matrix[j][i]){
                return false
            }
        }
    }
    return true
}

function sylvesters_criterion(matrix){

    for (let dimension = 1; dimension < matrix.length; dimension ++){
        let minor_matrix = []
        for (let i = 0; i < dimension; i++){
            let row_minor = []
            for(let j =0; j < dimension; j++){
                row_minor.push(matrix[i][j])
            }
            minor_matrix.push(row_minor)
        }
        let minor_determinant = get_determinant(minor_matrix)
        if (minor_determinant <= 0){
            return false
        }
    }
    return true

}

function is_diagonal_dominant(matrix){
    for (let i = 0; i < matrix.length; i++){
        let line_sum = 0
        let column_sum = 0
        for(let j = 0; j < matrix.length; j++){
            if(i != j){
                line_sum += Math.abs(matrix[i][j])
                column_sum += Math.abs(matrix[j][i])
            }
        }
        if(matrix[i][i] < line_sum || matrix[i][i] < column_sum){
            return false
        }
    }
    return true
}

export {backward_substitution, forward_substitution, get_determinant, is_positive_definite, is_diagonal_dominant}
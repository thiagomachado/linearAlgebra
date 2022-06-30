
$(() => {

    c1 = 1
    c2 = 2
    c3 = -3
    c4 = 3
    a = 0
    b = 1
    maxIter = 20
    deltaX = 0.5
    deltaX2 = 0.5
    TOLm = 0
    point = 0 


    function F(c1,c2,c3,c4,X){
        return c1*Math.exp(c2*X) + c3*X**c4
    }
    function F_derivative(c1,c2,c3,c4, X){
        return c1*c2*Math.exp(c2*X) + c3*c4*X**(c4-1)
    }

    function bisection(c1,c2,c3,c4,a,b,maxIter,TOLm){
        current_x = 0 
        number_of_iterations = 0
        while (True){
            current_x = (a + b) / 2
            if (Math.abs(a - b) <= TOLm){ 
                break;
            }
            if (number_of_iterations <= maxIter){ 
                break;
            }
            if (F(c1,c2,c3,c4,current_x) > 0){
                b = current_x
            }
            else{
                a = current_x;
            }
            number_of_iterations += 1;
        }
        console.log('number of iterations:',number_of_iterations);
        return current_x;
    }
    function newton(c1,c2,c3,c4,a,b,maxIter,TOLm){
        previous_x = (a + b)/2
        for (var i = 0; i < maxIter; i++) {{
            current_x = previous_x - (c1,c2,c3,c4,previous_x)/F_derivative(c1,c2,c3,c4,previous_x)
            if (Math.abs(current_x - previous_x) < TOLm){
                console.log(current_x)
                return current_x
            }
            previous_x = current_x
        }
        print_error('iterations limit reached')
    }


    //ponto, delta, decidir se vai ser 12ou3
    function forward_step(c1,c2,c3,c4,point,delta_x){
        derivative = (F(c1,c2,c3,c4, point + delta_x) - F(c1,c2,c3,c4, point)) / delta_x
        return derivative
    }

    function backward_step(c1,c2,c3,c4,point,delta_x){
        derivative = (F(c1,c2,c3,c4,point) - F(c1,c2,c3,c4,point - delta_x)) / delta_x
        return derivative
    }

    function central_difference(c1,c2,c3,c4,point,delta_x){
        derivative = (F(c1,c2,c3,c4,point+ self.delta_x) - sF(c1,c2,c3,c4,point - delta_x)) / (2 * delta_x)
        return derivative
    }



    function  RichardExtrapolationDerivative(c1,c2,c3,c4,point,delta_x1,delta_x2){
        result_delta_x1=forward_step(c1,c2,c3,c4,point,delta_x1)
        result_delta_x2=forward_step(c1,c2,c3,c4,point,delta_x2)

        q = result_delta_x1/result_delta_x2
        p = 1

        richard_solution = result_delta_x1 + (result_delta_x1 - result_delta_x2)/(q**(-p) - 1)
        return richard_solution
    }


    //extracted and translated to js from https://pomax.github.io/bezierinfo/legendre-gauss.html
    gauss_legendre_quadrature = {
        2: {
          'points': [-0.577350269189626, 0.577350269189626],
          'weights': [1.0, 1.0]
        },
        3: {
          'points': [-0.774596669241483, 0.0, 0.774596669241483],
          'weights': [0.555555555555556, 0.888888888888889, 0.555555555555556]
        },
        4: {
          'points': [-0.861136311594053, -0.339981043584856, 0.339981043584856, 0.861136311594053],
          'weights': [0.347854845137454, 0.652145154862546, 0.652145154862546, 0.347854845137454]
        },
        5: {
          'points': [-0.906179845938664, -0.538469310105683, 0.0, 0.538469310105683, 0.906179845938664],
          'weights': [0.236926885056189, 0.478628670499366, 0.568888888888889, 0.478628670499366, 0.236926885056189]
        },
        6: {
          'points': [-0.932469514203152, -0.661209386466265, -0.238619186083197, 0.238619186083197, 0.661209386466265, 0.932469514203152],
          'weights': [0.171324492379170, 0.360761573048139, 0.467913934572691, 0.467913934572691, 0.360761573048139, 0.171324492379170]
        },
        7: {
          'points': [-0.949107912342759, -0.741531185599394, -0.405845151377397, 0.0, 0.405845151377397, 0.741531185599394, 0.949107912342759],
          'weights': [0.129484966168870, 0.279705391489277, 0.381830050505118, 0.417959183673469, 0.381830050505118, 0.279705391489277, 0.129484966168870]
        },
        8: {
          'points': [-0.960289856570432, -0.796666477413627, -0.525532409916329, -0.183434642495650, 0.183434642495650, 0.525532409916329, 0.796666477413627, 0.960289856570432],
          'weights': [0.101228536290376, 0.222381034453374, 0.313706645877887, 0.362683783378362, 0.362683783378362, 0.313706645877887, 0.222381034453374, 0.101228536290376]
        },
        9: {
          'points': [-0.968160239507626, -0.836031107326636, -0.613371432700590, -0.324253423403809, 0.0, 0.324253423403809, 0.613371432700590, 0.836031107326636, 0.968160239507626],
          'weights': [0.081274388361574, 0.180648160694857, 0.260610696402935, 0.312347077040003, 0.330239355001260, 0.312347077040003, 0.260610696402935, 0.180648160694857, 0.081274388361574]
        },
        10: {
          'points': [-0.973906528517172, -0.865063366688985, -0.679409568299024, -0.433395394129247, -0.148874338981631, 0.148874338981631, 0.433395394129247, 0.679409568299024, 0.865063366688985, 0.973906528517172],
          'weights': [0.066671344308688, 0.149451349150581, 0.219086362515982, 0.269266719309996, 0.295524224714753, 0.295524224714753, 0.269266719309996, 0.219086362515982, 0.149451349150581, 0.066671344308688]
        }
      }
      
      function get_gauss_legendre_quadrature(n){
        return gauss_legendre_quadrature[n]
      }






}
)








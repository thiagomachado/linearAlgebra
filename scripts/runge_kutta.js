import * as utils from "./utils.js";
import * as basic from "./matrix_basic_operations.js"

var m = 0
var c = 0
var k = 0
var a1 = 0
var a2 = 0
var a3 = 0
var w1 = 0
var w2 = 0
var w3 = 0
var total_time = 0
var step = 0


$(() => {

    function f(m,c,k,a1,a2,a3,w1,w2,w3){
        return a1*Math.sin(w1*t) + a2*Math.sin(w2*t) + a3*Math.cos(w3*t)
    }


    function f_derivative(m,c,k,a1,a2,a3,w1,w2,w3, t, x, dx){
        return (f(m,c,k,a1,a2,a3,w1,w2,w3) - c*dx - k*x)/m
    }

    function solve(m,c,k,a1,a2,a3,w1,w2,w3){
        dy = y = t = 0
        half_step = self.step / 2
        // t = tempo, y = deslocamento, dy = velocidade, dyy = aceleração
        t0_moment = {'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': self.F_derivative(t, y, dy)} 
        moments = [t0_moment]
        //for _ in range(self.number_of_steps):
        for (var i = 0; i < int(total_time / step); i++) {
            K1 = half_step * self.F_derivative(t, y, dy)
            Q = half_step * (dy+1/2*K1)
            K2 = half_step * self.F_derivative(t+half_step, y+Q, dy+K1)
            K3 = half_step * self.F_derivative(t+half_step, y+Q, dy+K2)
            L = self.step*(dy+K3)
            K4 = half_step * self.F_derivative(t+self.step, y+L, dy+2*K3)

            // now increment Y, Y' and T
            y += self.step*(dy+(1/3)*(K1+K2+K3))
            dy += 1/3*(K1+2*K2+2*K3+K4)
            t += self.step
            moments.append({'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': self.F_derivative(t, y, dy)})
        }
        return moments 
    }



//     return (self.F(t) - self.c*dx - self.k*x)/self.m


}
)

// def F(self, t):
//     return var @a1*np.sin(self.w1*t) + self.a2*np.sin(self.w2*t) + self.a3*np.cos(self.w3*t)
  
//   def F_derivative(self, t, x, dx):
//     return (self.F(t) - self.c*dx - self.k*x)/self.m

//   def solve(self):
//     dy = y = t = 0
//     half_step = self.step / 2
//     # t = tempo, y = deslocamento, dy = velocidade, dyy = aceleração
//     t0_moment = {'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': self.F_derivative(t, y, dy)} 
//     moments = [t0_moment]
//     for _ in range(self.number_of_steps):
//       K1 = half_step * self.F_derivative(t, y, dy)
//       Q = half_step * (dy+1/2*K1)
//       K2 = half_step * self.F_derivative(t+half_step, y+Q, dy+K1)
//       K3 = half_step * self.F_derivative(t+half_step, y+Q, dy+K2)
//       L = self.step*(dy+K3)
//       K4 = half_step * self.F_derivative(t+self.step, y+L, dy+2*K3)

//       # now increment Y, Y' and T
//       y += self.step*(dy+(1/3)*(K1+K2+K3))
//       dy += 1/3*(K1+2*K2+2*K3+K4)
//       t += self.step
//       moments.append({'tempo': t, 'deslocamento': y, 'velocidade': dy, 'aceleracao': self.F_derivative(t, y, dy)})

//     return moments 




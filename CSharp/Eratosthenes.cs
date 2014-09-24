using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;

namespace Groups
{
    public class Eratosthenes : IEnumerable<int>
    {
        private static List<int> _primes = new List<int>();
        private int _lastChecked;


        public Eratosthenes()
        {
            _primes.Add(2);
            _lastChecked = 2;
        }


        private bool IsPrime(int checkValue)
        {
            bool isPrime = true;

            foreach (int prime in _primes)
            {
                if ((checkValue % prime) == 0 && prime <= Math.Sqrt(checkValue))
                {
                    isPrime = false;
                    break;
                }
            }

            return isPrime;
        }


        public IEnumerator<int> GetEnumerator()
        {
            foreach (int prime in _primes)
                yield return prime;

            while (_lastChecked < int.MaxValue)
            {
                _lastChecked++;

                if (IsPrime(_lastChecked))
                {
                    _primes.Add(_lastChecked);
                    yield return _lastChecked;
                }
            }
        }


        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}

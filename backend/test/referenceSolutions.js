// Known-correct C++ solutions for data/seedProblems.js, used to check the judge end to end.
export const REFERENCE_SOLUTIONS = {
"reverse-string": `string reverseString(string s){reverse(s.begin(),s.end());return s;}`,
"valid-palindrome": `bool isPalindrome(string s){string t;for(char c:s)if(isalnum((unsigned char)c))t+=tolower(c);string r=t;reverse(r.begin(),r.end());return t==r;}`,
"best-time-to-buy-and-sell-stock": `int maxProfit(vector<int>& p){int mn=INT_MAX,b=0;for(int x:p){mn=min(mn,x);b=max(b,x-mn);}return b;}`,
"valid-parentheses": `bool isValid(string s){string st;for(char c:s){if(c=='('||c=='['||c=='{')st+=c;else{if(st.empty())return false;char o=st.back();st.pop_back();if((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{'))return false;}}return st.empty();}`,
"binary-search": `int search(vector<int>& a,int t){int l=0,r=a.size()-1;while(l<=r){int m=(l+r)/2;if(a[m]==t)return m;if(a[m]<t)l=m+1;else r=m-1;}return -1;}`,
"longest-substring-without-repeating-characters": `int lengthOfLongestSubstring(string s){vector<int> last(256,-1);int b=0,l=0;for(int i=0;i<(int)s.size();i++){unsigned char c=s[i];if(last[c]>=l)l=last[c]+1;last[c]=i;b=max(b,i-l+1);}return b;}`,
"product-of-array-except-self": `vector<int> productExceptSelf(vector<int>& a){int n=a.size();vector<int> r(n,1);int p=1;for(int i=0;i<n;i++){r[i]=p;p*=a[i];}p=1;for(int i=n-1;i>=0;i--){r[i]*=p;p*=a[i];}return r;}`,
"number-of-islands": `void dfs(vector<vector<char>>& g,int i,int j){if(i<0||j<0||i>=(int)g.size()||j>=(int)g[0].size()||g[i][j]!='1')return;g[i][j]='0';dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);}
int numIslands(vector<vector<char>>& g){int c=0;for(int i=0;i<(int)g.size();i++)for(int j=0;j<(int)g[0].size();j++)if(g[i][j]=='1'){c++;dfs(g,i,j);}return c;}`,
"coin-change": `int coinChange(vector<int>& c,int a){vector<int> d(a+1,INT_MAX);d[0]=0;for(int i=1;i<=a;i++)for(int x:c)if(x<=i&&d[i-x]!=INT_MAX)d[i]=min(d[i],d[i-x]+1);return d[a]==INT_MAX?-1:d[a];}`,
"merge-intervals": `vector<vector<int>> merge(vector<vector<int>>& v){sort(v.begin(),v.end());vector<vector<int>> r;for(auto& x:v){if(!r.empty()&&x[0]<=r.back()[1])r.back()[1]=max(r.back()[1],x[1]);else r.push_back(x);}return r;}`,
"trapping-rain-water": `int trap(vector<int>& h){int l=0,r=h.size()-1,lm=0,rm=0,w=0;while(l<r){if(h[l]<h[r]){lm=max(lm,h[l]);w+=lm-h[l];l++;}else{rm=max(rm,h[r]);w+=rm-h[r];r--;}}return w;}`,
"longest-valid-parentheses": `int longestValidParentheses(string s){vector<int> st={-1};int b=0;for(int i=0;i<(int)s.size();i++){if(s[i]=='(')st.push_back(i);else{st.pop_back();if(st.empty())st.push_back(i);else b=max(b,i-st.back());}}return b;}`,
"edit-distance": `int minDistance(string a,string b){int n=a.size(),m=b.size();vector<vector<int>> d(n+1,vector<int>(m+1));for(int i=0;i<=n;i++)d[i][0]=i;for(int j=0;j<=m;j++)d[0][j]=j;for(int i=1;i<=n;i++)for(int j=1;j<=m;j++)d[i][j]=a[i-1]==b[j-1]?d[i-1][j-1]:1+min({d[i-1][j],d[i][j-1],d[i-1][j-1]});return d[n][m];}`,
"largest-rectangle-in-histogram": `int largestRectangleArea(vector<int>& h){vector<int> st;int b=0,n=h.size();for(int i=0;i<=n;i++){int c=i==n?0:h[i];while(!st.empty()&&h[st.back()]>=c){int H=h[st.back()];st.pop_back();int L=st.empty()?-1:st.back();b=max(b,H*(i-L-1));}st.push_back(i);}return b;}`,
"sliding-window-maximum": `vector<int> maxSlidingWindow(vector<int>& a,int k){deque<int> q;vector<int> r;for(int i=0;i<(int)a.size();i++){while(!q.empty()&&q.front()<=i-k)q.pop_front();while(!q.empty()&&a[q.back()]<=a[i])q.pop_back();q.push_back(i);if(i>=k-1)r.push_back(a[q.front()]);}return r;}`,
};

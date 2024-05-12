---
title: Principal Components Analysis 2
slug: pca2
links: []
backlinks: []

---

# Principal Components Analysis


Dimensionality reduction technique that projects a set of points in a
$d$-dimensional space to $k$-dimensional such that the coordintes of the target
space explain as much variance of the given points as possible.

## Technique (using Covariance matrix)

Given a set of points $X \in \mathbb{R}^{n \times d}$ we are looking for linear
projection $w\_1 \in \mathbb{R}^d$ such that the variance $Var(X\_{i\star}w\_1)$
<!--- for $i \in {1\dots n}$ is maximized. Let's treat $x \in \mathbb{R}^d$ as --->
<!--- random vector sampled from the distribution of input points (one of the rows of --->
<!--- $X$). --->


<!--- where $\Sigma$ is covariance matrix of $x$: $\Sigma = cov(x, x) = E\[(x − \mu)(x − --->
<!--- \mu)^T]$. --->

<!--- We contrain $w\_1$ to have unit length and use Lagrange multiplier method (TODO), --->
<!--- which gives us: --->

<!--- $$ --->
<!--- \Sigma w\_1 = \alpha w\_1 --->
<!--- $$ --->

<!--- Therefore $w\_1$ must be an eigenvector of covariance matrix $\Sigma$. If we want --->
<!--- maximize $w\_1^T\Sigma w\_1 = \alpha w\_1^T w\_1$ we must choose the eigenvector --->
<!--- with the largest eigenvalue. --->

<!--- ### Construction --->

<!--- We iteratively apply the steps described above with the additional constraint --->
<!--- that new $w\_i$ must be orthogonal to $w\_j$ for all $j\<i$. We get eigenvectors of --->
<!--- the covarience matrix, sorted by their corresponding eigenvalues. --->

<!--- When using covariance matricies to come up with principal components, you do not --->
<!--- need to center your data before hand as the covariance of the centered data is --->
<!--- the same as for non-centered. This, however, does not apply for other techniques --->
<!--- how to compute principal components. --->

<!--- ### Other techniques --->

<!--- Note that PCA can be done using other techniques such as Singular Value --->
<!--- Decomposition (SVD) TODO. --->

<!--- TODO: explained variance --->

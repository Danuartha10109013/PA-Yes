<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            table-layout: fixed;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 5px;
            text-align: left;
            word-wrap: break-word;
        }
        th {
            background-color: #f2f2f2;
        }
        h1 {
            text-align: center;
            font-size: 20px;
            margin-bottom: 10px;
        }
        p {
            text-align: center;
            margin-bottom: 20px;
        }

        /* Adjusted widths for Segmentasi Pasar table */
        table th:nth-child(1), table td:nth-child(1) { width: 12%; } /* Sektor */
        table th:nth-child(2), table td:nth-child(2) { width: 7%; }  /* Jml Item */
        table th:nth-child(3), table td:nth-child(3) { width: 10%; } /* Total Penjualan */
        table th:nth-child(4), table td:nth-child(4) { width: 10%; } /* Total Transaksi */
        table th:nth-child(5), table td:nth-child(5) { width: 10%; } /* K-Jumlah Item */
        table th:nth-child(6), table td:nth-child(6) { width: 10%; } /* K-Total Penjualan */
        table th:nth-child(7), table td:nth-child(7) { width: 10%; } /* K-Total Transaksi */
        table th:nth-child(8), table td:nth-child(8) { width: 8%; }  /* Status */
        table th:nth-child(9), table td:nth-child(9) { width: 10%; } /* Created At */
        table th:nth-child(10), table td:nth-child(10) { width: 10%; } /* Updated At */
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p>Tanggal: {{ $date }}</p>

    <table>
        <thead>
            <tr>
                <th>Nama Sektor</th>
                <th>Jml Item</th>
                <th>Total Penjualan</th>
                <th>Total Transaksi</th>
                <th>K-Jumlah Item</th>
                <th>K-Total Penjualan</th>
                <th>K-Total Transaksi</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($segmentasi_pasar as $report)
                <tr>
                    <td>{{ $report->sector->name ?? 'N/A' }}</td>
                    <td>{{ $report->jumlah_item }}</td>
                    <td>Rp{{ number_format(floatval($report->total_penjualan), 0, ',', '.') }}</td>
                    <td>{{ number_format(floatval($report->total_transaksi), 0, ',', '.') }}</td>
                    <td>{{ $report->kriteria_jumlah_item }}</td>
                    <td>{{ $report->kriteria_total_penjualan }}</td>
                    <td>{{ $report->kriteria_total_transaksi }}</td>
                    <td>{{ $report->status }}</td>
                    <td>{{ \Carbon\Carbon::parse($report->created_at)->format('d/m/Y H:i:s') }}</td>
                    <td>{{ \Carbon\Carbon::parse($report->updated_at)->format('d/m/Y H:i:s') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
